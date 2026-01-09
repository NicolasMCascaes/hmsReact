import React, { useState, useEffect } from 'react';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable, type DataTableFilterMeta } from 'primereact/datatable';
import { Column, type ColumnFilterElementTemplateOptions } from 'primereact/column';
import { Dropdown, type DropdownChangeEvent } from 'primereact/dropdown';
import { MultiSelect, type MultiSelectChangeEvent } from 'primereact/multiselect';
import { Tag } from 'primereact/tag';
import { ActionIcon, Button, LoadingOverlay, Modal, Select, TextInput } from '@mantine/core';
import { IconEdit, IconPlus, IconSearch, IconTrash } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { getDoctorDropdown } from '../../../services/DoctorProfileService';
import { DateTimePicker } from '@mantine/dates';
import dayjs from 'dayjs';
import { useForm } from '@mantine/form';
import { cancelAppointment, getAllAppointmentByPatient, scheduleAppointment } from '../../../services/AppointmentService';
import { useSelector } from 'react-redux';
import { errorNotification, sucessNotification } from '../../../utilities/NotificationUtility';
import { formatDateWithTime, toIsoLocalDateTime } from '../../../utilities/DateUtility';
import { appointmentReasons } from '../../../data/DropDownData';

interface Country {
  name: string;
  code: string;
}

interface Representative {
  name: string;
  image: string;
}

interface Customer {
  id: number;
  name: string;
  country: Country;
  company: string;
  date: string | Date;
  status: string;
  verified: boolean;
  activity: number;
  representative: Representative;
  balance: number;
}

const Appointment =() => {
    
    const [selectedCustomers, setSelectedCustomers] = useState<Customer[]>([]);
    const[doctors, setDoctors] = useState<any[]>([])
    const [opened, { open, close }] = useDisclosure(false);
    const user = useSelector((state:any) => state.user)
    const [loading, setLoading] = useState(false)
    const [visible, { toggle }] = useDisclosure(false);
    const [appointments, setAppointments] = useState<any[]>([])

    const [filters, setFilters] = useState<DataTableFilterMeta>({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        'country.name': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        representative: { value: null, matchMode: FilterMatchMode.IN },
        date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
        balance: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        status: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        activity: { value: null, matchMode: FilterMatchMode.BETWEEN }
    });
    const [globalFilterValue, setGlobalFilterValue] = useState<string>('');
    const [representatives] = useState<Representative[]>([
        { name: 'Amy Elsner', image: 'amyelsner.png' },
        { name: 'Anna Fali', image: 'annafali.png' },
        { name: 'Asiya Javayant', image: 'asiyajavayant.png' },
        { name: 'Bernardo Dominic', image: 'bernardodominic.png' },
        { name: 'Elwin Sharvill', image: 'elwinsharvill.png' },
        { name: 'Ioni Bowcher', image: 'ionibowcher.png' },
        { name: 'Ivan Magalhaes', image: 'ivanmagalhaes.png' },
        { name: 'Onyama Limba', image: 'onyamalimba.png' },
        { name: 'Stephen Shaw', image: 'stephenshaw.png' },
        { name: 'XuXue Feng', image: 'xuxuefeng.png' }
    ]);
    const [statuses] = useState<string[]>(['unqualified', 'qualified', 'new', 'negotiation', 'renewal']);

    const getSeverity = (status: string) => {
        switch (status) {
            case 'CANCELLED':
                return 'danger';

            case 'COMPLETED':
                return 'success';

            case 'SCHEDULED':
                return 'info';
        }
    };

    useEffect(() => {
        getAllAppointmentByPatient(user.profileId).then((data) =>{
            console.log(data)
            setAppointments(data)
        }).catch((error:any)=>{
            console.log(error)
        })
        getDoctorDropdown().then((data)=>{
            setDoctors(data.map((doctor:any)=>({
                value:""+doctor.id,
                label:doctor.name
            })))
        }).catch((error)=>{
            console.log(error)
        })
    }, []);


    const form = useForm({
    initialValues: {
        patientId:user.profileId,
        doctorId:'',
        appointmentTime: new Date(),
        status:'SCHEDULED',
        reason:'',
        notes:''
    },

    validate: {
        doctorId: (value) => !value ? 'Escolha um profissional para realizar a sua consulta!' : undefined,
        appointmentTime: (value) => !value ? 'Informe a data e horário do seu atendimento!' : undefined,
        reason: (value) => !value ? 'Informe o motivo do seu agendamento!' : undefined
    },
  });
  
  const handleSubmit = (values: typeof form.values) =>{
    console.log(values)
    const formattedValues = {
        ...values,
        appointmentTime: toIsoLocalDateTime(values.appointmentTime)
    }
    scheduleAppointment(formattedValues).then((data)=>{
        setLoading(true)
        form.reset()
        sucessNotification("Consulta agendada com sucesso!")
    }).catch((error:any)=>{
        console.log(error)
        errorNotification(error.response.data.errorMessage)
        
    }).finally(()=>{setLoading(false), close()})

  }
    
  const handleDelete = (appointmentId: any) =>{
    cancelAppointment(appointmentId).then(()=>{
        sucessNotification("Agendamento cancelado!")
    }).catch((error:any)=>{
        console.log(error)
        errorNotification("Erro ao cancelar agendamento")
    })
  }

    

    const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        let _filters:any = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const renderHeader = () => {
        return (
            <div className="flex flex-wrap gap-2 justify-between items-center">
                    <Button leftSection={<IconPlus/>} onClick={open}>Agendar Consulta</Button>
                    <TextInput value={globalFilterValue} leftSection={<IconSearch/>} fw={500} onChange={onGlobalFilterChange} placeholder="Pesquisar palavra-chave" />
            </div>
        );
    };

    

    

    const representativeFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
        return (
            <React.Fragment>
                <div className="mb-3 font-bold">Agent Picker</div>
                <MultiSelect value={options.value} options={representatives} itemTemplate={representativesItemTemplate} onChange={(e: MultiSelectChangeEvent) => options.filterCallback(e.value)} optionLabel="name" placeholder="Any" className="p-column-filter" />
            </React.Fragment>
        );
    };

    const representativesItemTemplate = (option: Representative) => {
        return (
            <div className="flex align-items-center gap-2">
                <img alt={option.name} src={`https://primefaces.org/cdn/primereact/images/avatar/${option.image}`} width="32" />
                <span>{option.name}</span>
            </div>
        );
    };

    

   

    

    
    const statusTranslations: Record<string, string> = {
        SCHEDULED: 'Agendada',
        CANCELLED: 'Cancelada',
        COMPLETED: 'Concluída',
    };
    const statusBodyTemplate = (rowData: Customer) => {
        const translation = statusTranslations[rowData.status] || rowData.status
        return <Tag value={translation} severity={getSeverity(rowData.status)} />;
    };

    const statusFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
        return <Dropdown value={options.value} options={statuses} onChange={(e: DropdownChangeEvent) => options.filterCallback(e.value, options.index)} itemTemplate={statusItemTemplate} placeholder="Select One" className="p-column-filter" showClear />;
    };

    const statusItemTemplate = (option: string) => {
        return <Tag value={option} severity={getSeverity(option)} />;
    };
      const actionBodyTemplate = (rowData :any) => {
        return <div className='flex gap-2'>
            <ActionIcon>
                <IconEdit size={20} stroke={1.5}/>
            </ActionIcon>

            <ActionIcon color='red' onClick={ ()=> {console.log("rowData.idAppointment =", rowData.idAppointment), handleDelete(Number(rowData.idAppointment))}}>
                
                <IconTrash size={20} stroke={1.5}/>
            </ActionIcon>
            </div>
    };
   


    
    const header = renderHeader();

    const timeTemplate = (rowData: any) =>{
        return <span className='text-red-400'>{formatDateWithTime(rowData.appointmentTime)}</span>
    }
    

    return (
        <div className="card">
            <DataTable value={appointments} size='small' paginator header={header} rows={10}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    rowsPerPageOptions={[10, 25, 50]} dataKey="id" selectionMode="checkbox" selection={selectedCustomers} 
                    onSelectionChange={(e) => {
                        const customers = e.value as Customer[];
                        setSelectedCustomers(customers);
                    }}
                    filters={filters} filterDisplay="menu" globalFilterFields={['doctorName', 'appointmentTime', 'reason', 'notes', 'status']}
                    emptyMessage="Nenhuma consulta encontrada." currentPageReportTemplate="Mostrando {first} - {last} de {totalRecords} consultas">
                <Column field="doctorName" header="Doutor" sortable filter filterPlaceholder="Procurar por nome" style={{ minWidth: '14rem' }} />
                <Column field="appointmentTime" header="Data e horário" body={timeTemplate} sortable style={{ minWidth: '14rem' }} />
                <Column field="reason" header="Motivo da consulta" sortable filter style={{ minWidth: '14rem' }} />
                <Column field="notes" header="Observações adicionais" sortable filter style={{ minWidth: '14rem' }} />
                <Column field="status" header="Status" sortable filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '12rem' }} body={statusBodyTemplate} filter filterElement={statusFilterTemplate} />
                <Column headerStyle={{ width: '5rem', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} body={actionBodyTemplate} />
            </DataTable>
            <Modal opened={opened} onClose={close} size="lg" title={<div className='text-xl font-semibold text-primary-400 font-poppins'>Agendar Consulta</div>} centered>
                <form onSubmit={form.onSubmit(handleSubmit)}>
                <div className='flex flex-col gap-5'>
                <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
                <Select withAsterisk data={doctors} label="Doutor" placeholder='Selecione o doutor para a consulta' {...form.getInputProps('doctorId')}  />
                <DateTimePicker {...form.getInputProps('appointmentTime')} minDate={new Date()} withAsterisk label="Data e hora da consulta" placeholder="Selecione data e hora da sua consulta"
                    presets={[
                        { value: dayjs().format('YYYY-MM-DD HH:mm:ss'), label: 'Hoje' },
                        { value: dayjs().add(1, 'day').format('YYYY-MM-DD HH:mm:ss'), label: 'Amanhã' },
                        { value: dayjs().add(1, 'month').format('YYYY-MM-DD HH:mm:ss'), label: 'No próximo mês' },
                        { value: dayjs().add(1, 'year').format('YYYY-MM-DD HH:mm:ss'), label: 'No próximo ano' },
                    ]}
                    />
                <Select withAsterisk data={appointmentReasons} label="Motivo da consulta" placeholder='Qual o motivo da consulta?'{...form.getInputProps('reason')}/>
                <TextInput label="Observações adicionais" {...form.getInputProps('notes')}/>
                <Button type='submit' onClick={toggle}>Agendar!</Button>  
              </div>
            </form>
                
            </Modal>
        </div>
    );
    
}
export default Appointment