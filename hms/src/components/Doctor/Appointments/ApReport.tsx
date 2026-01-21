import { ActionIcon, Button, Fieldset, MultiSelect, NumberInput, Select, Textarea, TextInput } from "@mantine/core"
import { frequency, routes, sintoms, tests, types } from "../../../data/DropDownData"
import { IconTrash } from "@tabler/icons-react"
import { useForm } from "@mantine/form"
import { createApReport } from "../../../services/AppointmentService"
import { errorNotification, sucessNotification } from "../../../utilities/NotificationUtility"
import { useState } from "react"


const ApReport = ({appointment}:any) => {
    const [loading, setLoading] = useState(false)
    type Medicine = {
        name: string
        medicineId?:number
        dosage:string
        frequency: string
        duration: number
        route:string
        type:string
        instructions:string
        prescriptionId?:number
    }
    const form = useForm({
        initialValues: {
        sintoms:[],
        tests:[],
        diagnosis:'',
        referral: '',
        notes:'',
        prescription:{
            notes:'',
            medicines: [] as Medicine[]
        }
    },
    validate: {
        sintoms: (value) => (value.length > 0 ? null : 'Selecione pelo menos 1 sintoma!'),
        diagnosis: (value) => (value.trim() ? null : 'O diagnóstico é obrigatório!'),
        prescription: {
            medicines:{
                name: value => (value.trim() ? null : 'O nome do medicamento é obrigatório'),
                dosage: value => (value.trim() ? null : 'Insira a dosagem'),
                frequency: value => (value.trim() ? null : 'Inclua a frequência'),
                duration: value => (value > 0 ? null : 'A duração deve ser maior do que 0'),
                route: value => (value ? null : 'Inclua a via de admnistração do medicamento'),
                type: value => (value ? null : 'Inclua o tipo do medicamento'),
                instructions: value =>(value ? null : "Inclua as instruções de uso do medicamento")
            }
        }

    },
    })
    const insertMedicine = () => {
        form.insertListItem('prescription.medicines', { name: '', dosage: '', frequency: '', duration: 0, route: '', type: '', instructions: '' })
    }
    const removeMedicine = (index: number) =>{
        form.removeListItem('prescription.medicines', index)
    }
    const handleSubmit = (values: typeof form.values) => {
        let data ={
            ...values,
            doctorId: appointment.doctorId,
            patientId: appointment.patientId,
            appointmentId: appointment.idAppointment,
            prescription: {
                ...values.prescription,
                doctorId: appointment.doctorId,
                patientId: appointment.patientId,
                appointmentId: appointment.idAppointment
            }
        }
        console.log(data)
        setLoading(true)
        createApReport(data).then(()=>{
            sucessNotification("OK lets go")
            
        }).catch((error:any)=>{
            console.log(error)
            errorNotification(error.response.data.errorMessage)
        }).finally(()=>{
            setLoading(false)
        })
    }
  return (
    <form onSubmit={form.onSubmit(handleSubmit)}>
    <Fieldset className="grid grid-cols-1 gap-5" legend={<span className="text-lg font-medium text-primary-500">Informações</span>} style={{ border: '1px solid #67e1cf'}}>
        <MultiSelect withAsterisk label="Sintomas" clearable searchable  comboboxProps={{ transitionProps: { transition: 'pop', duration: 200 } }} {...form.getInputProps("sintoms")} data={sintoms}/>
        <MultiSelect label="Exames solicitados"{...form.getInputProps("tests")} data={tests} />
        <TextInput label="Diagnóstico" placeholder="Insira o diagnóstico do paciente" withAsterisk {...form.getInputProps("diagnosis")}/>
        <TextInput label="Encaminhamento" placeholder="Descreva o encaminhamento do paciente" {...form.getInputProps("referral")}/>
        <Textarea label="Anotações adicionais" placeholder="Anotações" {...form.getInputProps("notes")}/>
    </Fieldset>
    <div className="grid gap-4 grid-cols-1">

     <Fieldset className="grid grid-cols-1 gap-5" legend={<span className="text-lg font-medium text-primary-500">Prescrição</span>} style={{ border: '1px solid #67e1cf'}}>
     <Textarea label="Anotações adicionais" placeholder="Anotações" {...form.getInputProps(`prescription.notes`)}/>
     {
        form.values.prescription.medicines.map((medicine: Medicine, index: number) => (
        <div key={index} className="grid grid-cols-1 gap-3">
        <div className="flex items-center col-span-1 justify-between">
            <h1 className="text-xl font-medium">Medicamento {index + 1}</h1>
            <ActionIcon onClick={()=>removeMedicine(index)} variant="filled" size="lg" color="red" className="mb-2">
                <IconTrash/>
            </ActionIcon>
        </div>
        <TextInput label="Medicamento" placeholder="Insira o nome do medicamento" {...form.getInputProps(`prescription.medicines.${index}.name`)} withAsterisk/>
        <TextInput label="Dosagem" placeholder="Dosagem do medicamento"  {...form.getInputProps(`prescription.medicines.${index}.dosage`)}  withAsterisk/>
        <Select label="Frequência" placeholder="Frequência em que o paciente irá tomar o medicamento" data={frequency} {...form.getInputProps(`prescription.medicines.${index}.frequency`)}   withAsterisk/>
        <NumberInput label="Duração" placeholder="Insira a duração do tratamento(em dias)" {...form.getInputProps(`prescription.medicines.${index}.duration`)}  withAsterisk/>
        <Select label="Vias de admnistração" placeholder="Selecione a via" data={routes} {...form.getInputProps(`prescription.medicines.${index}.route`)} withAsterisk/>
        <Select label="Tipo do medicamento" placeholder="Selecione a via" data={types} {...form.getInputProps(`prescription.medicines.${index}.type`)}  withAsterisk/>
        <TextInput label="Instruções" placeholder="Insira as instruções do medicamento para o paciente" {...form.getInputProps(`prescription.medicines.${index}.instructions`)} />
        
        </div>
        ))}
        <Button className="col-span-1" color="primary" onClick={insertMedicine}>Adicionar Medicamento</Button>
    </Fieldset>
    <div className="flex flex-row justify-between">
        <Button type="submit" loading={loading}color="primary">Salvar Relatório</Button>
        <Button variant = "filled" color="red" type="reset">Cancelar</Button>
    </div>
    </div>
    </form>
  )
}

export default ApReport