import { ActionIcon, Button, Fieldset, LoadingOverlay, NumberInput, Select, TextInput } from "@mantine/core"
import { useForm } from "@mantine/form"
import { IconEdit, IconPlus, IconSearch, IconTrash } from "@tabler/icons-react"
import { useEffect, useState } from "react"
import { DataTable, type DataTableFilterMeta } from "primereact/datatable"
import { Column } from "primereact/column"
import { FilterMatchMode } from "primereact/api"
import { Toolbar } from "primereact/toolbar"
import { errorNotification, sucessNotification } from "../../../utilities/NotificationUtility"
import 'dayjs/locale/pt-br';
import { getAllMedicines } from "../../../services/MedicineService"
import { Tag } from "primereact/tag"
import { getSaleItemsBySaleId } from "../../../services/SaleItemService"
import { createSale } from "../../../services/SalesService"

type SaleItem = {
  medicineId: string
  quantity: number | string
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
}

const Sales = () => {
  const [loading, setLoading] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false)
  const [editingInventoryId, setEditingInventoryId] = useState<number | null>(null)
  const [tableLoading, setTableLoading] = useState(false)
  const [globalFilterValue, setGlobalFilterValue] = useState("")
  const [data, setData] = useState<any[]>([])
  const [medicineOptions, setMedicineOptions] = useState<MedicineOption[]>([])
  const [filters, setFilters] = useState<DataTableFilterMeta>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  })
  const isEditing = editingInventoryId !== null

  const getMedicineOptionById = (medicineId: string | number) => {
    return medicineOptions.find((option) => option.value === String(medicineId))
  }

  const form = useForm({
    initialValues: {
      saleItems: [{ medicineId: "", quantity: 1 }] as SaleItem[],
    },
    validate: {
      saleItems: {
        medicineId: (value) => (value ? null : "Selecione um medicamento"),
        quantity: (value) => (value && Number(value) > 0 ? null : "Insira uma quantidade válida"),
      },
    },
  })
  const fetchData = () => {
    setTableLoading(true)
    getSaleItemsBySaleId(3)
      .then((res) => {
        console.log(res)
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
          ? res.map((medicine: MedicineRecord) => ({
            value: String(medicine.idMedicine),
            name: medicine.name,
            label: medicine.name,
            manufacturer: medicine.manufacturer,
            price: Number(medicine.price),
            stock: medicine.stock,
          })).filter((option) => option.value)
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
    const normalizedQuantity = (values.saleItems[0]?.quantity) ? Number(values.saleItems[0].quantity) : NaN
    const normalizedMedicineId = (values.saleItems[0]?.medicineId)

    const payload = {
      saleItems: values.saleItems.map((item:any) => ({
        medicineId: Number(item.medicineId),
        quantity: Number(item.quantity),
        unitPrice: getMedicineOptionById(item.medicineId)?.price || 0,
      })),
      totalAmount: values.saleItems.reduce((total:any, item:any) => {
        const itemTotal = (Number(item.quantity) || 0) * (getMedicineOptionById(item.medicineId)?.price || 0)
        return total + itemTotal
      }, 0)
    }
    console.log("Payload before validation:", payload)

    if (!normalizedMedicineId || Number.isNaN(normalizedQuantity)) {
      errorNotification("Preencha os dados da venda corretamente antes de enviar.")
      return
    }
    console.log(payload)
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

 const onAddMoreMedicines = () => {
  form.insertListItem("saleItems", {
    medicineId: "",
    quantity: 1
  });
};
  const onCreateNew = () => {
    setEditingInventoryId(null)
    setIsFormOpen(true)
  }

  const onCancelForm = () => {
    setIsFormOpen(false)
    setEditingInventoryId(null)
    form.setValues({
      saleItems: [{ medicineId: "", quantity: 1 }],
    })
  }

  const onEdit = (rowData: any) => {
    setEditingInventoryId(rowData.id ?? null)
    form.setValues({
      saleItems: [
        {
          medicineId: String(rowData.medicineId),
          quantity: rowData.quantity,
        },
      ],
    })
    setIsFormOpen(true)
  }
  const actionBodyTemplate = (rowData: any) => {
    return (
      <div className='flex gap-2'>
        <ActionIcon onClick={() => onEdit(rowData)}>
          <IconEdit size={20} stroke={1.5} />
        </ActionIcon>
      </div>
    )
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
  const nameBodyTemplate = (rowData: any) => {
    const option = getMedicineOptionById(rowData.medicineId)
    const name = option?.name || rowData.name || ""
    const manufacturer = option?.manufacturer || rowData.manufacturer || ""

    if (!name) {
      return "-"
    }

    return manufacturer ? `${name} (${manufacturer})` : name
  }

  return (
    <div className="space-y-4">
      {isFormOpen ?
        <form className="grid gap-5" onSubmit={form.onSubmit(handleSubmit)}>
          <LoadingOverlay visible={loading} />
          <Fieldset
            className="grid grid-cols-5 gap-4"
            legend={<span className="text-lg font-medium text-primary-500">{isEditing ? "Atualizar estoque" : "Adicionar estoque"}</span>}
            style={{ border: "1px solid #67e1cf" }}
          >

              {form.values.saleItems.map((item, index) => (
                <div key={index} className="col-span-5 grid grid-cols-5 gap-4">

                  <div className="col-span-2">
                    <Select
                      label="Medicamento"
                      placeholder="Selecione o medicamento"
                      renderOption={({ option }) => {
                        const selectedOption = medicineOptions.find((item) => item.value === option.value)
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
                      rightSection ={<div className="text-xs flex gap-1 text-white bg-red-400 rounded-md p-1">Disponível: {getMedicineOptionById(item.medicineId)?.stock}</div>}
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
                  <div className="flex justify-between items-center">
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
                <div className="col-span-5 flex justify-center pt-2 pb-1">
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
        : null}
      {!isFormOpen ? (
        <>
          <Toolbar className="mb-4" start={leftToolbarTemplate} end={rightToolbarTemplate} />

          <DataTable
            value={data}
            size="small"
            paginator
            rows={10}
            loading={tableLoading}
            filters={filters}
            globalFilterFields={["name", "expireDate", "batchNo", "quantity", "stockStatus"]}
            dataKey="idMedicine"
            emptyMessage="Nenhuma venda encontrada."
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            rowsPerPageOptions={[10, 25, 50]}
            currentPageReportTemplate="Mostrando {first} - {last} de {totalRecords} vendas"
          >
            <Column field="name" header="Medicamento" body={nameBodyTemplate} sortable style={{ minWidth: "14rem" }} />
            <Column field="batchNo" header="Número do lote" sortable style={{ minWidth: "14rem" }} />
            <Column field="quantity" header="Quantidade" sortable style={{ minWidth: "10rem" }} />
            <Column headerStyle={{ width: '5rem', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} body={actionBodyTemplate} />
          </DataTable>
        </>
      ) : null}
    </div>

  )
}

export default Sales
