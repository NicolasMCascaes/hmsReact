import React, { useState, useEffect } from 'react';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable, type DataTableFilterMeta } from 'primereact/datatable';
import { Column, type ColumnFilterElementTemplateOptions } from 'primereact/column';
import { Dropdown, type DropdownChangeEvent } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';
import { ActionIcon, Button, LoadingOverlay, Modal, Select, TextInput, Text, SegmentedControl } from '@mantine/core';
import { IconEdit, IconPlus, IconSearch, IconTrash } from '@tabler/icons-react';
import { useDisclosure } from '@mantine/hooks';
import { getDoctorDropdown } from '../../../services/DoctorProfileService';
import { DateTimePicker } from '@mantine/dates';
import dayjs from 'dayjs';
import { useForm } from '@mantine/form';
import { cancelAppointment, getAllAppointmentByDoctor, getAllAppointmentByPatient, scheduleAppointment } from '../../../services/AppointmentService';
import { useSelector } from 'react-redux';
import { errorNotification, sucessNotification } from '../../../utilities/NotificationUtility';
import { formatDateWithTime, toIsoLocalDateTime } from '../../../utilities/DateUtility';
import { appointmentReasons } from '../../../data/DropDownData';
import { modals } from '@mantine/modals';
import { Toolbar } from 'primereact/toolbar';



interface Customer {
    id: number;
    name: string;
    company: string;
    date: string | Date;
    status: string;
    verified: boolean;
    activity: number;
    balance: number;
}

const Appointment = () => {

    const [selectedCustomers, setSelectedCustomers] = useState<Customer[]>([]);
    const [doctors, setDoctors] = useState<any[]>([])
    const [opened, { open, close }] = useDisclosure(false);
    const user = useSelector((state: any) => state.user)
    const [loading, setLoading] = useState(false)
    const [, { toggle }] = useDisclosure(false);
    const [appointments, setAppointments] = useState<any[]>([])
    const [tab, setTab] = useState<string>('Hoje');

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
    const [globalFilterValue, setGlobalFilterValue] = useState<string>('');

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
        fetchData()
        getDoctorDropdown().then((data) => {
            setDoctors(data.map((doctor: any) => ({
                value: "" + doctor.id,
                label: doctor.name
            })))
        }).catch((error) => {
            console.log(error)
        })
    }, []);

    const fetchData = () => {
        getAllAppointmentByDoctor(user.profileId).then((data) => {
            setAppointments(data)
        }).catch((error: any) => {
            console.log(error)
        })
    }
    const form = useForm({
        initialValues: {
            patientId: user.profileId,
            doctorId: '',
            appointmentTime: new Date(),
            status: 'SCHEDULED',
            reason: '',
            notes: ''
        },

        validate: {
            doctorId: (value) => !value ? 'Escolha um profissional para realizar a sua consulta!' : undefined,
            appointmentTime: (value) => !value ? 'Informe a data e horário do seu atendimento!' : undefined,
            reason: (value) => !value ? 'Informe o motivo do seu agendamento!' : undefined
        },
    });

    const handleSubmit = (values: typeof form.values) => {
        const formattedValues = {
            ...values,
            appointmentTime: toIsoLocalDateTime(values.appointmentTime)
        }
        scheduleAppointment(formattedValues).then(() => {

            setLoading(true)
            form.reset()
            sucessNotification("Consulta agendada com sucesso!")
        }).catch((error: any) => {
            console.log(error)
            errorNotification(error.response.data.errorMessage)

        }).finally(() => { setLoading(false), close() })

    }

    const handleDelete = (idAppointment: number) => {
        modals.openConfirmModal({
            title: <span className='text-xl font-semibold font-serif'>Você tem certeza que quer cancelar esse agendamento?</span>,
            centered: true,
            children: (
                <Text size="sm">
                    Essa ação não poderá ser desfeita, e o seu médico saberá que você cancelou!
                </Text>
            ),
            labels: { confirm: 'Confirmar', cancel: 'Cancelar' },
            onCancel: () => {

            },
            onConfirm: () => {
                cancelAppointment(idAppointment).then(() => {
                    console.log(idAppointment)
                    setLoading(true)
                    sucessNotification("Agendamento cancelado com sucesso!")
                    setAppointments((prev) =>
                        prev.map((appointment) =>
                            appointment.idAppointment === idAppointment
                                ? { ...appointment, status: "CANCELLED" }
                                : appointment
                        )
                    );
                }).catch((error) => {
                    console.log(error)
                    errorNotification(error.response.data.errorMessage)
                })
            },
        });
    }



    const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        let _filters: any = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
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

    const actionBodyTemplate = (rowData: any) => {
        return <div className='flex gap-2'>
            <ActionIcon color='red' onClick={() => { console.log("rowData.idAppointment =", rowData.idAppointment), handleDelete(Number(rowData.idAppointment)) }}>

                <IconTrash size={20} stroke={1.5} />
            </ActionIcon>
        </div>
    };
    const timeTemplate = (rowData: any) => {
        return <span className='text-red-400'>{formatDateWithTime(rowData.appointmentTime)}</span>
    }
   
    const centerToolBarTemplate = () => {
        return (
            <SegmentedControl
                value={tab}
                onChange={setTab}
                variant='filled'
                color={tab === "Hoje" ? "blue" : tab === "Próximas" ? "green" : "red"}
                data={["Hoje", "Próximas", "Anteriores"]}
            />
        )
    }
    const rightToolbarTemplate = () => {
        return <TextInput value={globalFilterValue} leftSection={<IconSearch />} fw={500} onChange={onGlobalFilterChange} placeholder="Pesquisar palavra-chave" />;
    };
    const filteredAppointments = appointments.filter((appointment) => {
        const appointmentDate = new Date(appointment.appointmentTime)
        const today = new Date()

        // Zera horas, minutos e segundos de ambos
        appointmentDate.setHours(0, 0, 0, 0)
        today.setHours(0, 0, 0, 0)

        if (tab === "Hoje") {
            return appointmentDate.getTime() === today.getTime()
        } else if (tab === "Próximas") {
            return appointmentDate.getTime() > today.getTime()
        } else if (tab === "Anteriores") {
            return appointmentDate.getTime() < today.getTime()
        }
    })
    return (
        <div className="card">
            <Toolbar className="mb-4"  center={centerToolBarTemplate} end={rightToolbarTemplate}></Toolbar>
            <DataTable value={filteredAppointments} size='small' paginator rows={10}
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                rowsPerPageOptions={[10, 25, 50]} dataKey="idAppointment" selectionMode="checkbox" selection={selectedCustomers}
                onSelectionChange={(e) => {
                    const customers = e.value as Customer[];
                    setSelectedCustomers(customers);
                }}
                filters={filters} filterDisplay="menu" globalFilterFields={['patientName', 'appointmentTime', 'reason', 'notes', 'status']}
                emptyMessage="Nenhuma consulta encontrada." currentPageReportTemplate="Mostrando {first} - {last} de {totalRecords} consultas">
                <Column field="patientName" header="Paciente" sortable filter filterPlaceholder="Procurar por nome" style={{ minWidth: '14rem' }} />
                <Column field="patientPhone" header="Telefone para contato" filter filterPlaceholder="Procurar telefone" style={{ minWidth: '14rem' }} />
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
                        <Select withAsterisk data={doctors} label="Doutor" placeholder='Selecione o doutor para a consulta' {...form.getInputProps('doctorId')} />
                        <DateTimePicker {...form.getInputProps('appointmentTime')} minDate={new Date()} withAsterisk label="Data e hora da consulta" placeholder="Selecione data e hora da sua consulta"
                            presets={[
                                { value: dayjs().format('YYYY-MM-DD HH:mm:ss'), label: 'Hoje' },
                                { value: dayjs().add(1, 'day').format('YYYY-MM-DD HH:mm:ss'), label: 'Amanhã' },
                                { value: dayjs().add(1, 'month').format('YYYY-MM-DD HH:mm:ss'), label: 'No próximo mês' },
                                { value: dayjs().add(1, 'year').format('YYYY-MM-DD HH:mm:ss'), label: 'No próximo ano' },
                            ]}
                        />
                        <Select withAsterisk data={appointmentReasons} label="Motivo da consulta" placeholder='Qual o motivo da consulta?'{...form.getInputProps('reason')} />
                        <TextInput label="Observações adicionais" {...form.getInputProps('notes')} />
                        <Button type='submit' onClick={toggle}>Agendar!</Button>
                    </div>
                </form>

            </Modal>
        </div>
    );

}
export default Appointment