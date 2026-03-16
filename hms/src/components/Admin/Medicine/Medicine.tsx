import { ActionIcon, Button, Fieldset, NumberInput, Select, TextInput } from "@mantine/core"
import { useForm } from "@mantine/form"
import { IconEdit, IconSearch } from "@tabler/icons-react"
import { useEffect, useState } from "react"
import { DataTable, type DataTableFilterMeta } from "primereact/datatable"
import { Column } from "primereact/column"
import { FilterMatchMode } from "primereact/api"
import { Toolbar } from "primereact/toolbar"
import { addMedicine, getAllMedicines, updateMedicine } from "../../../services/MedicineService"
import { errorNotification, sucessNotification } from "../../../utilities/NotificationUtility"
import {
  medicineCategories,
  medicineCategoryLabels,
  medicineTypes,
  medicineTypeLabels,
} from "../../../data/DropDownData"

type MedicineFormValues = {
  name: string
  category: string
  type: string
  manufacturer: string
  price: number | string
  dosage: string
}

type MedicineRecord = MedicineFormValues & {
  idMedicine?: number
}

const Medicine = () => {
  const [loading, setLoading] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false)
  const [editingMedicineId, setEditingMedicineId] = useState<number | null>(null)
  const [tableLoading, setTableLoading] = useState(false)
  const [globalFilterValue, setGlobalFilterValue] = useState("")
  const [data, setData] = useState<MedicineRecord[]>([])
  const [filters, setFilters] = useState<DataTableFilterMeta>({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  })
  const isEditing = editingMedicineId !== null

  const form = useForm<MedicineFormValues>({
    initialValues: {
      name: "",
      category: "",
      type: "",
      manufacturer: "",
      price: 0,
      dosage: "",
    },
    validate: {
      name: (value) => (value.trim() ? null : "O nome do medicamento e obrigatorio"),
      category: (value) => (value.trim() ? null : "A categoria do medicamento e obrigatoria"),
      type: (value) => (value.trim() ? null : "O tipo do medicamento e obrigatorio"),
      manufacturer: (value) => (value.trim() ? null : "O fabricante do medicamento e obrigatorio"),
      price: (value) => {
        const parsed = Number(String(value).replace(",", "."))
        return parsed > 0 ? null : "O preco do medicamento deve ser maior que zero"
      },
      dosage: (value) => (value.trim() ? null : "A dosagem do medicamento e obrigatoria"),
    },
  })

  const normalizePrice = (value: number | string): string => {
    const parsed = Number(String(value).replace(",", "."))
    return Number.isFinite(parsed) ? parsed.toFixed(2) : "0.00"
  }

  const fetchData = () => {
    setTableLoading(true)
    getAllMedicines()
      .then((res) => {
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

  useEffect(() => {
    fetchData()
  }, [])

  const onGlobalFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setGlobalFilterValue(value)
    setFilters({
      global: { value, matchMode: FilterMatchMode.CONTAINS },
    })
  }

  const handleSubmit = (values: MedicineFormValues) => {
    const payload = {
      ...values,
      idMedicine: editingMedicineId ?? undefined,
      price: normalizePrice(values.price),
    }
    let method
    let update = false
    if (isEditing) {
      method = updateMedicine
      update = true
    } else {
      method = addMedicine
    }
    setLoading(true)
    method(payload)
      .then(() => {
        if(update){
          sucessNotification("Medicamento atualizado com sucesso!")
        } else {
          sucessNotification("Medicamento adicionado com sucesso!")
        }
        form.reset()
        setEditingMedicineId(null)
        setIsFormOpen(false)
        fetchData()
      })
      .catch((error: any) => {
        console.log(error)
        errorNotification(error?.response?.data?.errorMessage || "Erro ao adicionar medicamento")
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const onCreateNew = () => {
    setEditingMedicineId(null)
    form.reset()
    setIsFormOpen(true)
  }

  const onCancelForm = () => {
    setIsFormOpen(false)
    setEditingMedicineId(null)
    form.reset()
  }

  const onEdit = (rowData: any) => {
    setEditingMedicineId(rowData.idMedicine ?? null)
    form.setValues({
      name: rowData.name,
      category: rowData.category,
      type: rowData.type,
      manufacturer: rowData.manufacturer,
      price: rowData.price,
      dosage: rowData.dosage,
    })
    setIsFormOpen(true)
  }
  const actionBodyTemplate = (rowData: MedicineRecord) => {
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
            Cadastrar medicamento
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
        placeholder="Pesquisar medicamento"
      />
      
    )
  }

  const priceBodyTemplate = (rowData: MedicineRecord) => {
    const value = Number(String(rowData.price ?? 0).replace(",", "."))
    return Number.isFinite(value)
      ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)
      : "R$ 0,00"
  }

  const categoryBodyTemplate = (rowData: MedicineRecord) => {
    return medicineCategoryLabels[rowData.category] ?? rowData.category
  }

  const typeBodyTemplate = (rowData: MedicineRecord) => {
    return medicineTypeLabels[rowData.type] ?? rowData.type
  }

  return (
    <div className="space-y-4">
      {isFormOpen ? <Fieldset
        className="grid grid-cols-1 gap-5"
        legend={<span className="text-lg font-medium text-primary-500">{isEditing ? "Atualizar medicamento" : "Cadastrar medicamento"}</span>}
        style={{ border: "1px solid #67e1cf" }}
      >
        <form className="grid grid-cols-1 gap-4 md:grid-cols-2" onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput label="Nome" placeholder="Insira o nome do medicamento" withAsterisk {...form.getInputProps("name")} />
          <Select
            label="Categoria"
            placeholder="Selecione a categoria"
            data={medicineCategories}
            searchable
            withAsterisk
            {...form.getInputProps("category")}
          />
          <Select
            label="Tipo do medicamento"
            placeholder="Selecione o tipo"
            data={medicineTypes}
            searchable
            withAsterisk
            {...form.getInputProps("type")}
          />
          <TextInput
            label="Fabricante"
            placeholder="Insira o fabricante"
            withAsterisk
            {...form.getInputProps("manufacturer")}
          />
          <NumberInput
            label="Preco"
            min={0}
            decimalScale={2}
            fixedDecimalScale
            clampBehavior="strict"
            thousandSeparator="."
            decimalSeparator="," 
            placeholder="0,00"
            withAsterisk
            {...form.getInputProps("price")}
          />
          <TextInput label="Dosagem" placeholder="Ex: 500mg" withAsterisk {...form.getInputProps("dosage")} />

          <div className="md:col-span-2 flex justify-end gap-3">
            <Button type="submit" loading={loading} color="primary">
              {isEditing ? "Atualizar" : "Cadastrar"} medicamento
            </Button>
            <Button type="button" loading={loading} onClick={onCancelForm} color="red">
              Cancelar
            </Button>

          </div>
        </form>
      </Fieldset> : null} 
        
       <Toolbar className="mb-4" start={leftToolbarTemplate} end={rightToolbarTemplate} />

       <DataTable
        value={data}
        size="small"
        paginator
        rows={10}
        loading={tableLoading}
        filters={filters}
        globalFilterFields={["name", "category", "type", "manufacturer", "dosage"]}
        dataKey="idMedicine"
        emptyMessage="Nenhum medicamento encontrado."
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        rowsPerPageOptions={[10, 25, 50]}
        currentPageReportTemplate="Mostrando {first} - {last} de {totalRecords} medicamentos"
      >
        <Column field="name" header="Nome" sortable style={{ minWidth: "14rem" }} />
        <Column field="category" header="Categoria" sortable body={categoryBodyTemplate} style={{ minWidth: "12rem" }} />
        <Column field="type" header="Tipo" sortable body={typeBodyTemplate} style={{ minWidth: "12rem" }} />
        <Column field="manufacturer" header="Fabricante" sortable style={{ minWidth: "14rem" }} />
        <Column field="dosage" header="Dosagem" style={{ minWidth: "10rem" }} />
        <Column field="price" header="Preco" sortable body={priceBodyTemplate} style={{ minWidth: "10rem" }} />
         <Column headerStyle={{ width: '5rem', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} body={actionBodyTemplate} />
      </DataTable>
    </div>
    
  )
}

export default Medicine
