import { ActionIcon, Button, Fieldset, MultiSelect, NumberInput, SegmentedControl, Select, Textarea, TextInput } from "@mantine/core"
import { frequency, medicineTypes, routes, sintoms, tests } from "../../../data/DropDownData"
import { IconEye, IconLayoutGrid, IconSearch, IconTable, IconTrash } from "@tabler/icons-react"
import { useForm } from "@mantine/form"
import { createApReport, getPatientReports, reportExist } from "../../../services/AppointmentService"
import { errorNotification, sucessNotification } from "../../../utilities/NotificationUtility"
import { useEffect, useState } from "react"
import { DataTable, type DataTableFilterMeta } from "primereact/datatable"
import { Column } from "primereact/column"
import { useNavigate } from "react-router-dom"
import { formatDateWithTime } from "../../../utilities/DateUtility"
import { FilterMatchMode, FilterOperator } from "primereact/api"
import { Toolbar } from "primereact/toolbar"
import { getAllMedicines } from "../../../services/MedicineService"
import ReportCard from "./ReportCard"

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
    type?: string
}

const ApReport = ({ appointment }: any) => {
    const [view, setView] = useState<string>("table")
    const [loading, setLoading] = useState(false)
    const [globalFilterValue, setGlobalFilterValue] = useState<string>('');
    const [data, setData] = useState<any[]>([])
    const [allowAdd, setAllowAdd] = useState<boolean>(false)
    const [edit, setEdit] = useState<boolean>(false)
    const [medicineOptions, setMedicineOptions] = useState<MedicineOption[]>([])
    const navigate = useNavigate()
    type Medicine = {
        name: string
        medicineId?: string | number | undefined
        dosage: string
        frequency: string
        duration: number
        route: string
        type: string
        instructions: string
        prescriptionId?: number
    }
    const form = useForm({
        initialValues: {
            sintoms: [],
            tests: [],
            diagnosis: '',
            referral: '',
            notes: '',
            prescription: {
                notes: '',
                medicines: [] as Medicine[]
            }
        },
        validate: {
            sintoms: (value) => (value.length > 0 ? null : 'Selecione pelo menos 1 sintoma!'),
            diagnosis: (value) => (value.trim() ? null : 'O diagnóstico é obrigatório!'),
            prescription: {
                medicines: {
                    name: value => (value.trim() ? null : 'O nome do medicamento é obrigatório'),
                    dosage: value => (value.trim() ? null : 'Insira a dosagem'),
                    frequency: value => (value.trim() ? null : 'Inclua a frequência'),
                    duration: value => (value > 0 ? null : 'A duração deve ser maior do que 0'),
                    route: value => (value ? null : 'Inclua a via de admnistração do medicamento'),
                    type: value => (value ? null : 'Inclua o tipo do medicamento'),
                    instructions: value => (value ? null : "Inclua as instruções de uso do medicamento")
                }
            }

        },
    })
    useEffect(() => {
        fetchData()
        fetchMedicineDropdown()
    }, [appointment])
    const fetchData = () => {
        if (appointment?.patientId) {
            getPatientReports(appointment?.patientId).then((res) => {
                setData(res)
            }).catch((error: any) => {
                console.log(error)
            })
        }
        if (appointment?.idAppointment) {
            reportExist(appointment.idAppointment)
                .then((res) => { setAllowAdd(!res) })
                .catch((error) => {
                    console.log(error)
                    setAllowAdd(true)
                })
        }
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
                            type: medicine.type
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
    const insertMedicine = () => {
        form.insertListItem('prescription.medicines', { medicineId: '', name: '', dosage: '', frequency: '', duration: 0, route: '', type: '', instructions: '' })
    }
    const removeMedicine = (index: number) => {
        form.removeListItem('prescription.medicines', index)
    }
    const handleSubmit = (values: typeof form.values) => {
        let data = {
            ...values,
            doctorId: appointment.doctorId,
            patientId: appointment.patientId,
            appointmentId: appointment.idAppointment,
            prescription: {
                ...values.prescription,
                medicines: values.prescription.medicines.map((medicine) => ({
                    ...medicine,
                    medicineId: medicine.medicineId && medicine.medicineId !== "OTHER" ? String(medicine.medicineId) : undefined
                })),
                doctorId: appointment.doctorId,
                patientId: appointment.patientId,
                appointmentId: appointment.idAppointment
            }
        }
        console.log(data)
        setLoading(true)
        createApReport(data).then(() => {
            sucessNotification("Medicamento adicionado com sucesso!")
            form.reset()
            setEdit(false)
            setAllowAdd(false)
            fetchData()
        }).catch((error: any) => {
            console.log(error)
            errorNotification(error.response.data.errorMessage)
        }).finally(() => {
            setLoading(false)
        })
    }
    const handleChangeMed = (index: number, medicineId: string | null) => {
        form.setFieldValue(`prescription.medicines.${index}.medicineId`, medicineId || '')
        const selectedMedicine = medicineOptions.find(med => String(med.value) === String(medicineId))
        console.table({ medicineId, selectedMedicine })
        if (selectedMedicine) {
            form.setFieldValue(`prescription.medicines.${index}.name`, selectedMedicine.name)
            form.setFieldValue(`prescription.medicines.${index}.dosage`, selectedMedicine.dosage || '')
            form.setFieldValue(`prescription.medicines.${index}.type`, selectedMedicine.type || '')
            return
        }

        if (medicineId === "OTHER" || !medicineId) {
            form.setFieldValue(`prescription.medicines.${index}.name`, '')
            form.setFieldValue(`prescription.medicines.${index}.dosage`, '')
            form.setFieldValue(`prescription.medicines.${index}.type`, '')
        }
    }
    const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        let _filters: any = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };
    const [filters, setFilters] = useState<DataTableFilterMeta>({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        patientName: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        patientPhone: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        appointmentTime: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
        reason: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        notes: { value: null, matchMode: FilterMatchMode.IN },
        status: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        activity: { value: null, matchMode: FilterMatchMode.BETWEEN }
    });
    const timeTemplate = (rowData: any) => {
        return <span className='text-primary-900'>{formatDateWithTime(rowData.createdAt)}</span>
    }
    const rightToolbarTemplate = () => {
        return <div className='flex gap-5 items-center'>
            <SegmentedControl
                value={view}
                onChange={setView}
                data={[
                    { label: <IconTable />, value: 'table' },
                    { label: <IconLayoutGrid />, value: 'angular' },
                ]}
                color='primary'
            />
            <TextInput value={globalFilterValue} leftSection={<IconSearch />} fw={500} onChange={onGlobalFilterChange} placeholder="Pesquisar palavra-chave" />
        </div>;
    };
    const actionBodyTemplate = (rowData: any) => {
        return <div className='flex gap-2'>
            <ActionIcon onClick={() => navigate("/doctor/appointments/" + rowData.appointmentId)}>
                <IconEye size={20} stroke={1.5} />
            </ActionIcon>

        </div>
    };
    const leftToolbarTemplate = () => {
        return (allowAdd && (<Button variant="filled" onClick={() => setEdit(true)}>Adicionar relatório</Button>))
    }
    return (
        <div>
            {!edit ? <div> <Toolbar className="mb-4" left={leftToolbarTemplate} end={rightToolbarTemplate}></Toolbar>
                {view == "table" ? <DataTable value={data} size='small' paginator rows={10}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                rowsPerPageOptions={[10, 25, 50]} dataKey="idAppointment"
                emptyMessage="Nenhuma prescrição." currentPageReportTemplate="Mostrando {first} - {last} de {totalRecords} prescrições">
                <Column field="doctorName" header="Doutor" sortable style={{ minWidth: '14rem' }} />
                <Column field="reportDate" header="Data do relatório" body={timeTemplate} style={{ minWidth: '14rem' }} />
                <Column field="diagnosis" header="Diagnóstico" style={{ minWidth: '14rem' }} />
                <Column field="medicines" header="Medicamentos" body={(rowData) => rowData.medicines?.length ?? 0} style={{ minWidth: '14rem' }} />
                <Column field="notes" header="Observações adicionais" style={{ minWidth: '14rem' }} />
                <Column headerStyle={{ width: '5rem', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} body={actionBodyTemplate} />

            </DataTable> : <div className='grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-2 pt-2'>
                {data.map((appointment) => (
                    <ReportCard key={appointment.idAppointment} {...appointment} onNavigateToDetails={() => navigate("/doctor/appointments/" + appointment.appointmentId)} />
                ))}
            </div>}</div>
                : <form onSubmit={form.onSubmit(handleSubmit)}>
                    <Fieldset className="grid grid-cols-1 gap-5" legend={<span className="text-lg font-medium text-primary-500">Informações</span>} style={{ border: '1px solid #67e1cf' }}>
                        <MultiSelect withAsterisk label="Sintomas" clearable searchable comboboxProps={{ transitionProps: { transition: 'pop', duration: 200 } }} {...form.getInputProps("sintoms")} data={sintoms} />
                        <MultiSelect label="Exames solicitados"{...form.getInputProps("tests")} data={tests} />
                        <TextInput label="Diagnóstico" placeholder="Insira o diagnóstico do paciente" withAsterisk {...form.getInputProps("diagnosis")} />
                        <TextInput label="Encaminhamento" placeholder="Descreva o encaminhamento do paciente" {...form.getInputProps("referral")} />
                        <Textarea label="Anotações adicionais" placeholder="Anotações" {...form.getInputProps("notes")} />
                    </Fieldset>
                    <div className="grid gap-4 grid-cols-1">

                        <Fieldset className="grid grid-cols-1 gap-5" legend={<span className="text-lg font-medium text-primary-500">Prescrição</span>} style={{ border: '1px solid #67e1cf' }}>
                            <Textarea label="Anotações adicionais" placeholder="Anotações" {...form.getInputProps(`prescription.notes`)} />
                            {
                                form.values.prescription.medicines.map((_medicine: Medicine, index: number) => (
                                    <div key={index} className="grid grid-cols-1 gap-3">
                                        <div className="flex items-center col-span-1 justify-between">
                                            <h1 className="text-xl font-medium">Medicamento {index + 1}</h1>
                                            <ActionIcon onClick={() => removeMedicine(index)} variant="filled" size="lg" color="red" className="mb-2">
                                                <IconTrash />
                                            </ActionIcon>
                                        </div>
                                        
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
                                                                ? ` - ${selectedOption.manufacturer}`
                                                                : ""}
                                                        </span>
                                                    </div>
                                                )
                                            }}
                                            data={[...medicineOptions.filter((option) => {
                                                return !form.values.prescription.medicines.some((saleItem, saleIndex) => {
                                                    return saleIndex !== index && String(saleItem.medicineId) === option.value
                                                })
                                            }), {label: "Outro medicamento", value: "OTHER"}]}
                                            searchable
                                            withAsterisk
                                            {...form.getInputProps(`prescription.medicines.${index}.medicineId`)}
                                            onChange={(value) => {
                                                handleChangeMed(index, value)
                                            }}
                                            
                                        />
                                        {form.values.prescription.medicines[index].medicineId === "OTHER" && (
                                            <TextInput label="Nome" placeholder="Insira o nome do medicamento" {...form.getInputProps(`prescription.medicines.${index}.name`)} withAsterisk />
                                        )}
                                        <TextInput label="Dosagem" disabled={
                                                _medicine.medicineId !== undefined &&
                                                _medicine.medicineId !== "" &&
                                                _medicine.medicineId !== "OTHER"
                                            }placeholder="Dosagem do medicamento"  {...form.getInputProps(`prescription.medicines.${index}.dosage`)} withAsterisk />
                                        <Select label="Frequência" placeholder="Frequência em que o paciente irá tomar o medicamento" data={frequency} {...form.getInputProps(`prescription.medicines.${index}.frequency`)} withAsterisk />
                                        <NumberInput label="Duração" placeholder="Insira a duração do tratamento(em dias)" {...form.getInputProps(`prescription.medicines.${index}.duration`)} withAsterisk />
                                        <Select label="Vias de admnistração" placeholder="Selecione a via" data={routes} {...form.getInputProps(`prescription.medicines.${index}.route`)} withAsterisk />
                                        <Select disabled={
                                                _medicine.medicineId !== undefined &&
                                                _medicine.medicineId !== "" &&
                                                _medicine.medicineId !== "OTHER"
                                            } label="Tipo do medicamento" placeholder="Insira o tipo do medicamento" data={medicineTypes} {...form.getInputProps(`prescription.medicines.${index}.type`)} withAsterisk />
                                        <TextInput label="Instruções" placeholder="Insira as instruções do medicamento para o paciente" {...form.getInputProps(`prescription.medicines.${index}.instructions`)} />

                                    </div>
                                ))}
                            <Button className="col-span-1" color="primary" onClick={insertMedicine}>Adicionar Medicamento</Button>
                        </Fieldset>
                        <div className="flex flex-row justify-between">
                            <Button type="submit" loading={loading} color="primary">Salvar Relatório</Button>
                            <Button variant="filled" color="red" type="reset" onClick={() => setEdit(false)}>Cancelar</Button>
                        </div>
                    </div>
                </form>}
        </div>
    )
}

export default ApReport
