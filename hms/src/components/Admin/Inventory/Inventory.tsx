import { ActionIcon, Button, Fieldset, NumberInput, Select, TextInput } from "@mantine/core"
import { useForm } from "@mantine/form"
import { IconEdit, IconSearch } from "@tabler/icons-react"
import { useEffect, useMemo, useState } from "react"
import { DataTable, type DataTableFilterMeta } from "primereact/datatable"
import { Column } from "primereact/column"
import { FilterMatchMode } from "primereact/api"
import { Toolbar } from "primereact/toolbar"
import { errorNotification, sucessNotification } from "../../../utilities/NotificationUtility"
import { addStock, getAllStock, updateStockInventory } from "../../../services/InventoryService"
import { DateInput } from "@mantine/dates"
import 'dayjs/locale/pt-br';
import { toIsoLocalDate } from "../../../utilities/DateUtility"
import { getAllMedicineDropdown } from "../../../services/MedicineService"
import { Tag } from "primereact/tag"

type InventoryFormValues = {
  medicineId: string
  batchNo: string
  quantity: number | string
  expireDate: Date | null
}

type InventoryRecord = InventoryFormValues & {
  id?: number
  name?: string
  manufacturer?: string
  medicineId?: string | number
}

type MedicineDropdownRecord = {
  id: number
  name: string
  manufacturer: string
}

type MedicineOption = {
  value: string
  label: string
  manufacturer?: string
}

const Inventory = () => {
  const [loading, setLoading] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false)
  const [editingInventoryId, setEditingInventoryId] = useState<number | null>(null)
  const [tableLoading, setTableLoading] = useState(false)
  const [globalFilterValue, setGlobalFilterValue] = useState("")
  const [data, setData] = useState<InventoryRecord[]>([])
  const [medicineOptions, setMedicineOptions] = useState<MedicineOption[]>([])
  const [filters, setFilters] = useState<DataTableFilterMeta>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  })
  const isEditing = editingInventoryId !== null
  const medicineNameById = useMemo(() => {
    return new Map(medicineOptions.map((option) => [Number(option.value), option.label]))
  }, [medicineOptions])

  const medicineManufacturerById = useMemo(() => {
    return new Map(medicineOptions.map((option) => [Number(option.value), option.manufacturer || ""]))
  }, [medicineOptions])

  const tableData = useMemo(() => {
    return data.map((item) => ({
      ...item,
      name: item.name || medicineNameById.get(Number(item.medicineId)) || "-",
    }))
  }, [data, medicineNameById])

  const form = useForm<InventoryFormValues>({
    initialValues: {
      medicineId: "",
      batchNo: "",
      quantity: 0,
      expireDate: null,
    },
    validate: {
      medicineId: (value) => (value ? null : "Escolha o medicamento que você deseja adicionar ao estoque"),
      quantity: (value) => (value ? null : "A quantidade do medicamento e obrigatoria"),
      batchNo: (value) => (value ? null : "O número do lote do medicamento e obrigatorio"),
      expireDate: (value) => (value ? null : "A data de validade do medicamento e obrigatoria"),
    },
  })
  const fetchData = () => {
    setTableLoading(true)
    getAllStock()
      .then((res) => {
        console.log(res)
        setData(Array.isArray(res) ? res : [])
      })
      .catch((error: any) => {
        console.log(error)
        errorNotification(error?.response?.data?.errorMessage || "Erro ao carregar medicamentos")
      })
      .finally(() => {
        setTableLoading(false)
      })
  }

  const fetchMedicineDropdown = () => {
    getAllMedicineDropdown()
      .then((res) => {
        const dropdownData = Array.isArray(res)
          ? res.map((medicine: MedicineDropdownRecord) => ({
              value: String(medicine.id),
              label: medicine.name,
              manufacturer: medicine.manufacturer,
            }))
          : []
        setMedicineOptions(dropdownData)
      })
      .catch((error: any) => {
        console.log(error)
        errorNotification(error?.response?.data?.errorMessage || "Erro ao carregar medicamentos para seleção")
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

  const handleSubmit = (values: InventoryFormValues) => {
    const normalizedQuantity = Number(values.quantity)
    const normalizedMedicineId = Number(values.medicineId)

    const payload = {
      id: isEditing ? editingInventoryId : undefined,
      medicineId: normalizedMedicineId,
      batchNo: values.batchNo,
      quantity: normalizedQuantity,
      expireDate: values.expireDate ? toIsoLocalDate(values.expireDate) : undefined,
    }

    if (!normalizedMedicineId || Number.isNaN(normalizedQuantity)) {
      errorNotification("Preencha os dados do estoque corretamente")
      return
    }

    console.log(payload)
    let method
    let update = false
    if (isEditing) {
      method = updateStockInventory
      update = true
    } else {
      method = addStock
    }
    setLoading(true)
    method(payload)
      .then(() => {
        if(update){
          sucessNotification("Estoque atualizado com sucesso!")
        } else {
          sucessNotification("Estoque adicionado com sucesso!")
        }
        form.reset()
        setEditingInventoryId(null)
        setIsFormOpen(false)
        fetchData()
      })
      .catch((error: any) => {
        console.log(error)
        errorNotification(error?.response?.data?.errorMessage || "Erro ao adicionar estoque")
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const onCreateNew = () => {
    setEditingInventoryId(null)
    form.reset()
    setIsFormOpen(true)
  }

  const onCancelForm = () => {
    setIsFormOpen(false)
    setEditingInventoryId(null)
    form.reset()
  }

  const onEdit = (rowData: any) => {
    setEditingInventoryId(rowData.id ?? null)
    form.setValues({
      medicineId: String(rowData.medicineId ?? ""),
      batchNo: rowData.batchNo,
      quantity: rowData.quantity,
      expireDate: rowData.expireDate ? new Date(rowData.expireDate) : null,
    })
    setIsFormOpen(true)
  }
  const actionBodyTemplate = (rowData: InventoryRecord) => {
    return (
        <div className='flex gap-2'>
            <ActionIcon onClick={() => onEdit(rowData)}>
                <IconEdit size={20} stroke={1.5}/>
            </ActionIcon>
        </div>
    )
  }
  const leftToolbarTemplate = () => {
    return (
        <>
        {!isFormOpen ? (
          <Button color="primary" onClick={onCreateNew}>
            Adicionar estoque
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
        placeholder="Pesquisar medicamento no estoque"
      />
      
    )
  }

  const statusBodyTemplate = (rowData: any) => {
    return rowData.stockStatus === "ACTIVE" ? (<Tag severity="success" value="Ativo" />) : (
      <Tag severity="danger" value="Inativo" />
    )
  }
  const nameBodyTemplate = (rowData: InventoryRecord) => {
    const medicineId = Number(rowData.medicineId)
    const name = medicineNameById.get(medicineId) || rowData.name || ""
    const manufacturer = medicineManufacturerById.get(medicineId) || rowData.manufacturer || ""

    if (!name) {
      return "-"
    }

    return manufacturer ? `${name} (${manufacturer})` : name
  }

  return (
    <div className="space-y-4">
      {isFormOpen ? <Fieldset
        className="grid grid-cols-1 gap-5"
        legend={<span className="text-lg font-medium text-primary-500">{isEditing ? "Atualizar estoque" : "Adicionar estoque"}</span>}
        style={{ border: "1px solid #67e1cf" }}
      >
        <form className="grid grid-cols-1 gap-4 md:grid-cols-2" onSubmit={form.onSubmit(handleSubmit)}>
             <Select
            label="Medicamento"
            placeholder="Selecione o medicamento"
            data={medicineOptions}
            searchable
            disabled={isEditing}
            withAsterisk
            {...form.getInputProps("medicineId")}
          />
          <TextInput label="Número do lote" placeholder="Insira o número do lote" withAsterisk {...form.getInputProps("batchNo")} />
          <NumberInput
            label="Quantidade"
            min={0}
            decimalScale={2}
            clampBehavior="strict"
            thousandSeparator="."
            decimalSeparator="," 
            placeholder="Insira a quantidade atual do medicamento"
            withAsterisk
            {...form.getInputProps("quantity")}
          />
          <DateInput
            label="Data de validade"
            placeholder="Selecione a data de validade"
            withAsterisk
            {...form.getInputProps("expireDate")}
            valueFormat="DD/MM/YYYY"
            locale="pt-br"
          />

          <div className="md:col-span-2 flex justify-end gap-3">
            <Button type="submit" loading={loading} color="primary">
              {isEditing ? "Atualizar" : "Adicionar"} estoque
            </Button>
            <Button type="button" loading={loading} onClick={onCancelForm} color="red">
              Cancelar
            </Button>

          </div>
        </form>
      </Fieldset> : null} 
        
       <Toolbar className="mb-4" start={leftToolbarTemplate} end={rightToolbarTemplate} />

      <DataTable
       value={tableData}
        size="small"
        paginator
        rows={10}
        loading={tableLoading}
        filters={filters}
        globalFilterFields={["name", "expireDate", "batchNo", "quantity", "stockStatus"]}
        dataKey="idMedicine"
        emptyMessage="Nenhum medicamento encontrado."
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        rowsPerPageOptions={[10, 25, 50]}
        currentPageReportTemplate="Mostrando {first} - {last} de {totalRecords} medicamentos"
      >
        <Column field="name" header="Medicamento" body={nameBodyTemplate} sortable style={{ minWidth: "14rem" }} />
        
        <Column field="expireDate" header="Data de validade" sortable style={{ minWidth: "12rem" }} />
        <Column field="batchNo" header="Número do lote" sortable style={{ minWidth: "14rem" }} />
        <Column field="quantity" header="Quantidade" sortable style={{ minWidth: "10rem" }} />
        <Column field="stockStatus" header="Status" sortable body={statusBodyTemplate} style={{ minWidth: "10rem" }} />
        <Column headerStyle={{ width: '5rem', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} body={actionBodyTemplate} />
      </DataTable>
    </div>
    
  )
}

export default Inventory
