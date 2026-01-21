
import { ActionIcon, Fieldset, TextInput } from '@mantine/core';
import { IconEye, IconSearch } from '@tabler/icons-react';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Column } from 'primereact/column';
import { DataTable, type DataTableFilterMeta,  } from 'primereact/datatable';
import { Toolbar } from 'primereact/toolbar';
import { useEffect, useState } from 'react'
import { getPrescriptionsByPatientId } from '../../../services/AppointmentService';
import { formatDateWithTime } from '../../../utilities/DateUtility';
import { useNavigate } from 'react-router-dom';

const Prescriptions = ({appointment}:any) => {
    
    const [data, setData] = useState<any[]>([])
    const [globalFilterValue, setGlobalFilterValue] = useState<string>('');
    const navigate = useNavigate()
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
        useEffect(() => {
  if (appointment?.patientId) {
    getPrescriptionsByPatientId(appointment.patientId)
      .then((res) => {
        console.log(res)
        setData(res)
      })
      .catch((error: any) => {
        console.log(error)
      })
  }
}, [appointment])
    const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value;
            let _filters: any = { ...filters };
    
            _filters['global'].value = value;
    
            setFilters(_filters);
            setGlobalFilterValue(value);
        };
       const timeTemplate = (rowData: any) => {
        return <span className='text-primary-900'>{formatDateWithTime(rowData.prescriptionDate)}</span>
    }
    const rightToolbarTemplate = () => {
        return <TextInput value={globalFilterValue} leftSection={<IconSearch />} fw={500} onChange={onGlobalFilterChange} placeholder="Pesquisar palavra-chave" />;
    };
    const actionBodyTemplate = (rowData: any) => {
            return <div className='flex gap-2'>
                <ActionIcon onClick={()=>navigate("/doctor/appointments/" + rowData.appointmentId)}>
                    <IconEye size={20} stroke={1.5} />
                </ActionIcon>
                
            </div>
        };
  return (
    <div>
        <Toolbar className="mb-4" end={rightToolbarTemplate}></Toolbar>
        <Fieldset legend={<span className="text-lg font-medium text-primary-500">Informações</span>} style={{ border: '1px solid gray'}}> 
        <DataTable value={data} size='small' paginator rows={10}
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        rowsPerPageOptions={[10, 25, 50]} dataKey="idAppointment"
                        emptyMessage="Nenhuma prescrição." currentPageReportTemplate="Mostrando {first} - {last} de {totalRecords} prescrições">
                        <Column field="doctorName" header="Doutor" sortable style={{ minWidth: '14rem' }} />
                        <Column field="prescriptionDate" header="Data da prescrição" body={timeTemplate} style={{ minWidth: '14rem' }} />
                        <Column field="medicines" header="Medicamentos" body={(rowData)=>rowData.medicines?.length??0} style={{ minWidth: '14rem' }} />
                        <Column field="notes" header="Observações adicionais" style={{ minWidth: '14rem' }} />
                        <Column headerStyle={{ width: '5rem', textAlign: 'center' }} bodyStyle={{ textAlign: 'center', overflow: 'visible' }} body={actionBodyTemplate} />
                        
                    </DataTable>
                    </Fieldset>
    </div>
  )
}

export default Prescriptions