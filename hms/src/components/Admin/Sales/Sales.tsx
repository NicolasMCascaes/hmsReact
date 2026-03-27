import { ActionIcon, Button, Card, Divider, Fieldset, Group, Input, LoadingOverlay, Modal, NumberInput, Select, Stack, Text, TextInput } from "@mantine/core"
import { useForm } from "@mantine/form"
import { IconEye, IconPill, IconPlus, IconSearch, IconTrash } from "@tabler/icons-react"
import { useEffect, useState } from "react"
import { DataTable, type DataTableFilterMeta } from "primereact/datatable"
import { Column } from "primereact/column"
import { FilterMatchMode } from "primereact/api"
import { Toolbar } from "primereact/toolbar"
import { errorNotification, sucessNotification } from "../../../utilities/NotificationUtility"
import "dayjs/locale/pt-br"
import { getAllMedicines } from "../../../services/MedicineService"
import { getSaleItemsBySaleId } from "../../../services/SaleItemService"
import { createSale, getAllSales } from "../../../services/SalesService"
import PhoneInput from "react-phone-input-2"
import { formatDateWithTime } from "../../../utilities/DateUtility"
import { useDisclosure } from "@mantine/hooks"

type SaleItem = {
  medicineId: string
  quantity: number | string
  batchNo?: string
  unitPrice?: number
}

type MedicineRecord = {
  idMedicine: number
  name: string
  category?: string
  type?: string
  manufacturer: string
  price: number
  stock?: number
  createdAt?: string
  dosage?: string
}

type MedicineOption = {
  value: string
  name: string
  label: string
  manufacturer?: string
  price?: number
  stock?: number
  dosage?: string
}

const Sales = () => {
  const [loading, setLoading] = useState(false)
  const [opened, { open, close }] = useDisclosure(false)
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false)
  const [editingInventoryId, setEditingInventoryId] = useState<number | null>(null)
  const [tableLoading, setTableLoading] = useState(false)
  const [globalFilterValue, setGlobalFilterValue] = useState("")
  const [data, setData] = useState<any[]>([])
  const [medicineOptions, setMedicineOptions] = useState<MedicineOption[]>([])
  const [selectedSaleItems, setSelectedSaleItems] = useState<SaleItem[]>([])
  const [filters, setFilters] = useState<DataTableFilterMeta>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  })
  const isEditing = editingInventoryId !== null

  const getMedicineOptionById = (medicineId: string | number) => {
    return medicineOptions.find((option) => option.value === String(medicineId))
  }

  const form = useForm({
    initialValues: {
      buyerName: "",
      contactPhone: "",
      saleItems: [{ medicineId: "", quantity: 1 }] as SaleItem[],
    },
    validate: {
      buyerName: (value) => (value ? null : "O nome do comprador é obrigatório"),
      contactPhone: (value) => (value ? null : "O telefone de contato é obrigatório"),
      saleItems: {
        medicineId: (value) => (value ? null : "Selecione um medicamento"),
        quantity: (value) => (value && Number(value) > 0 ? null : "Insira uma quantidade válida"),
      },
    },
  })

  const fetchData = () => {
    setTableLoading(true)
    getAllSales()
      .then((res) => {
        setData(Array.isArray(res) ? res : [])
      })
      .catch((error: any) => {
        console.log(error)
        errorNotification(error?.response?.data?.errorMessage || "Erro ao carregar vendas")
      })
      .finally(() => {
        setTableLoading(false)
      })
  }

  const fetchMedicineDropdown = () => {
    getAllMedicines()
      .then((res) => {
        const dropdownData = Array.isArray(res)
          ? res
              .map((medicine: MedicineRecord) => ({
                value: String(medicine.idMedicine),
                name: medicine.name,
                label: medicine.name,
                manufacturer: medicine.manufacturer,
                price: Number(medicine.price),
                stock: medicine.stock,
                dosage: medicine.dosage,
              }))
              .filter((option) => option.value)
          : []
        setMedicineOptions(dropdownData)
      })
      .catch((error: any) => {
        console.log(error)
        errorNotification(error?.response?.data?.errorMessage || "Erro ao carregar medicamentos")
      })
  }

  useEffect(() => {
    fetchData()
    fetchMedicineDropdown()
  }, [])

  const onGlobalFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setGlobalFilterValue(value)
    setFilters({
      global: { value, matchMode: FilterMatchMode.CONTAINS },
    })
  }

  const handleSubmit = (values: any) => {
    const normalizedQuantity = values.saleItems[0]?.quantity ? Number(values.saleItems[0].quantity) : NaN
    const normalizedMedicineId = values.saleItems[0]?.medicineId

    const payload = {
      buyerName: values.buyerName,
      contactPhone: values.contactPhone,
      saleItems: values.saleItems.map((item: any) => ({
        medicineId: Number(item.medicineId),
        quantity: Number(item.quantity),
        unitPrice: getMedicineOptionById(item.medicineId)?.price || 0,
      })),
      totalAmount: values.saleItems.reduce((total: number, item: any) => {
        const itemTotal = (Number(item.quantity) || 0) * (getMedicineOptionById(item.medicineId)?.price || 0)
        return total + itemTotal
      }, 0),
    }

    if (!normalizedMedicineId || Number.isNaN(normalizedQuantity)) {
      errorNotification("Preencha os dados da venda corretamente antes de enviar.")
      return
    }

    const update = isEditing

    setLoading(true)
    createSale(payload)
      .then(() => {
        if (update) {
          sucessNotification("Item atualizado com sucesso!")
        } else {
          sucessNotification("Medicamento vendido com sucesso!")
        }
        form.reset()
        setEditingInventoryId(null)
        setIsFormOpen(false)
        fetchData()
      })
      .catch((error: any) => {
        console.log(error)
        errorNotification(error?.response?.data?.errorMessage || "Erro ao adicionar venda")
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const handleDetails = (rowData: any) => {
    setLoading(true)
    getSaleItemsBySaleId(rowData.id)
      .then((res) => {
        setSelectedSaleItems(Array.isArray(res) ? res : [])
        open()
      })
      .catch((error: any) => {
        console.log(error)
        errorNotification(error?.response?.data?.errorMessage || "Erro ao carregar itens da venda")
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const onAddMoreMedicines = () => {
    form.insertListItem("saleItems", {
      medicineId: "",
      quantity: 1,
    })
  }

  const onCreateNew = () => {
    setEditingInventoryId(null)
    setIsFormOpen(true)
  }

  const onCancelForm = () => {
    setIsFormOpen(false)
    setEditingInventoryId(null)
    form.setValues({
      buyerName: "",
      contactPhone: "",
      saleItems: [{ medicineId: "", quantity: 1 }],
    })
  }

  const actionBodyTemplate = (rowData: any) => {
    return (
      <div className="flex gap-2">
        <ActionIcon onClick={() => handleDetails(rowData)}>
          <IconEye size={20} stroke={1.5} />
        </ActionIcon>
      </div>
    )
  }

  const totalAmountBodyTemplate = (rowData: any) => {
    return `R$ ${Number(rowData.totalAmount || 0).toFixed(2)}`
  }

  const saleDateBodyTemplate = (rowData: any) => {
    return formatDateWithTime(rowData.saleDate)
  }

  const leftToolbarTemplate = () => {
    return (
      <>
        {!isFormOpen ? (
          <Button color="primary" onClick={onCreateNew}>
            Vender medicamento
          </Button>
        ) : null}
      </>
    )
  }

  const rightToolbarTemplate = () => {
    return (
      <TextInput
        value={globalFilterValue}
        leftSection={<IconSearch size={18} />}
        fw={500}
        onChange={onGlobalFilterChange}
        placeholder="Pesquisar venda"
      />
    )
  }

  return (
    <div className="space-y-4">
      {isFormOpen ? (
        <form className="grid gap-5" onSubmit={form.onSubmit(handleSubmit)}>
          <LoadingOverlay visible={loading} />
          <Fieldset
            className="grid gap-5"
            legend={<span className="text-lg font-medium text-primary-500">Informações do comprador</span>}
            style={{ border: "1px solid #67e1cf" }}
          >
            <div className="grid grid-cols-2 gap-2">
              <TextInput
                label="Nome do comprador"
                placeholder="Insira o nome do comprador"
                withAsterisk
                {...form.getInputProps("buyerName")}
              />

              <Input.Wrapper label="Telefone" withAsterisk error={form.errors.contactPhone}>
                <PhoneInput
                  country="br"
                  {...form.getInputProps("contactPhone")}
                  inputStyle={{ width: "100%" }}
                  placeholder="+55 (48) 99876-5432"
                />
              </Input.Wrapper>
            </div>
          </Fieldset>

          <Fieldset
            className="grid grid-cols-5 gap-4"
            legend={<span className="text-lg font-medium text-primary-500">Adicionar medicamento</span>}
            style={{ border: "1px solid #67e1cf" }}
          >
            {form.values.saleItems.map((item, index) => (
              <div key={index} className="col-span-5 grid grid-cols-5 gap-4">
                <div className="col-span-2">
                  <Select
                    label="Medicamento"
                    placeholder="Selecione o medicamento"
                    renderOption={({ option }) => {
                      const selectedOption = medicineOptions.find((medicine) => medicine.value === option.value)
                      return (
                        <div className="flex items-center gap-1">
                          <span>{selectedOption?.name ?? option.label}</span>
                          <span className="text-gray-500">
                            {selectedOption
                              ? ` - ${selectedOption.manufacturer} - R$ ${Number(selectedOption.price ?? 0).toFixed(2)}`
                              : ""}
                          </span>
                        </div>
                      )
                    }}
                    data={medicineOptions.filter((option) => {
                      return !form.values.saleItems.some((saleItem, saleIndex) => {
                        return saleIndex !== index && String(saleItem.medicineId) === option.value
                      })
                    })}
                    searchable
                    disabled={isEditing}
                    withAsterisk
                    {...form.getInputProps(`saleItems.${index}.medicineId`)}
                  />
                </div>

                <div className="col-span-2">
                  <NumberInput
                    rightSectionWidth={100}
                    rightSection={<div className="rounded-md bg-red-400 p-1 text-xs text-white">Disponível: {getMedicineOptionById(item.medicineId)?.stock}</div>}
                    label="Quantidade"
                    min={1}
                    max={getMedicineOptionById(item.medicineId)?.stock}
                    decimalScale={2}
                    clampBehavior="strict"
                    thousandSeparator="."
                    decimalSeparator=","
                    placeholder="Insira a quantidade atual do medicamento"
                    withAsterisk
                    {...form.getInputProps(`saleItems.${index}.quantity`)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    Total: R$ {(Number(item.quantity || 0) * Number(getMedicineOptionById(item.medicineId)?.price || 0)).toFixed(2)}
                  </div>
                  <div>
                    <ActionIcon color="red" onClick={() => form.removeListItem("saleItems", index)}>
                      <IconTrash size={20} stroke={1.5} />
                    </ActionIcon>
                  </div>
                </div>
              </div>
            ))}

            {!isEditing ? (
              <div className="col-span-5 flex justify-center pb-1 pt-2">
                <Button
                  type="button"
                  color="primary"
                  variant="outline"
                  leftSection={<IconPlus size={16} />}
                  onClick={onAddMoreMedicines}
                >
                  Adicionar mais
                </Button>
              </div>
            ) : null}
          </Fieldset>

          <div className="flex flex-col items-center gap-3">
            <div className="flex flex-wrap justify-center gap-3">
              <Button type="submit" loading={loading} color="primary">
                {isEditing ? "Atualizar" : "Vender"} medicamento
              </Button>
              <Button type="button" loading={loading} onClick={onCancelForm} color="red">
                Cancelar
              </Button>
            </div>
          </div>
        </form>
      ) : null}

      {!isFormOpen ? (
        <>
          <Toolbar className="mb-4" start={leftToolbarTemplate} end={rightToolbarTemplate} />

          <DataTable
            value={data}
            key="id"
            removableSort
            size="small"
            paginator
            rows={10}
            loading={tableLoading}
            filters={filters}
            globalFilterFields={["buyerName", "totalAmount", "contactPhone", "saleDate"]}
            dataKey="id"
            emptyMessage="Nenhuma venda encontrada."
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            rowsPerPageOptions={[10, 25, 50]}
            currentPageReportTemplate="Mostrando {first} - {last} de {totalRecords} vendas"
          >
            <Column field="buyerName" header="Comprador" sortable style={{ minWidth: "14rem" }} />
            <Column field="totalAmount" header="Valor total" body={totalAmountBodyTemplate} sortable style={{ minWidth: "10rem" }} />
            <Column field="contactPhone" header="Telefone de contato" sortable style={{ minWidth: "12rem" }} />
            <Column field="saleDate" header="Data da venda" body={saleDateBodyTemplate} sortable style={{ minWidth: "12rem" }} />
            <Column headerStyle={{ width: "5rem", textAlign: "center" }} bodyStyle={{ textAlign: "center", overflow: "visible" }} body={actionBodyTemplate} />
          </DataTable>
        </>
      ) : null}

      <Modal
        opened={opened}
        onClose={() => {
          setSelectedSaleItems([])
          close()
        }}
        title="Medicamentos vendidos"
      >
        <Stack gap="md">
          {selectedSaleItems.map((item, index) => {
            const medicine = getMedicineOptionById(item.medicineId)
            console.log(medicine)

            return (
              <Card key={`${item.medicineId}-${index}`} shadow="md" padding="lg" radius="md" withBorder style={{ border: "1px solid #8c8c8c" }}>
                <Group mb="md">
                  <IconPill size={22} />
                  <Text fw={600} size="lg">
                    {`${medicine?.name} (${medicine?.dosage ?? "Dosagem desconhecida"}) - ${medicine?.manufacturer ?? "Fabricante desconhecido"}`}
                  </Text>
                </Group>

                <Divider label="Informações do item" mb="sm" />

                <Stack gap={4}>
                  <Text>
                    <strong>Quantidade:</strong> {item.quantity}
                  </Text>
                  <Text>
                    <strong>Lote:</strong> {item.batchNo || "-"}
                  </Text>
                  <Text>
                    <strong>Valor unitário:</strong> R$ {Number(item.unitPrice || 0).toFixed(2)}
                  </Text>
                   <Text>
                    <strong>Total: </strong> R$ {(Number(item.quantity || 0) * (Number(item.unitPrice || 0))).toFixed(2)}
                  </Text>
                </Stack>

                <Divider mt="md" />
              </Card>
            )
          })}

          {selectedSaleItems.length === 0 ? <Text>Nenhum medicamento registrado nesta venda.</Text> : null}
        </Stack>
      </Modal>
    </div>
  )
}

export default Sales
