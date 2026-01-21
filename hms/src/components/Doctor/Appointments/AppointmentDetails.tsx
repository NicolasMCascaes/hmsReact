import { Link, useParams } from "react-router-dom"
import {Breadcrumbs, Card, Group, Text, Badge, Stack, Divider, Tabs } from '@mantine/core';
import { useEffect, useState } from "react";
import { getAppointmentDetails } from "../../../services/AppointmentService";
import { errorNotification } from "../../../utilities/NotificationUtility";
import { IconCalendar, IconClock, IconMail, IconMedicalCrossCircle, IconNotes, IconPhone, IconReportMedical, IconStethoscope, IconUser, IconVaccine } from "@tabler/icons-react";
import dayjs from "dayjs";
import ApReport from "./ApReport";
import Prescriptions from "./Prescriptions";
const AppointmentDetails = () => {
    const {idAppointment} = useParams()
    const [appointments, setAppointment] = useState<any>({})
    useEffect(() =>{
      getAppointmentDetails(idAppointment).then((data)=>{
        setAppointment(data)
      }).catch((error)=>{
        console.log(error)
        errorNotification("Erro ao buscar os dados do agendamento")
      })
    }, [idAppointment])
    const statusTranslations: Record<string, string> = {
        SCHEDULED: 'Agendada',
        CANCELLED: 'Cancelada',
        COMPLETED: 'Concluída',
    };
  return (
    <div className="">
      <Breadcrumbs mb="lg">
      <Link className="text-primary-400 hover:underline" to="/doctor/dashboard">Painel</Link>
      <Link className="text-primary-400 hover:underline" to="/doctor/appointments">Agendamentos</Link>
      <Text className="text-primary-400">Detalhes</Text>
      </Breadcrumbs>
        <div className="flex flex-col gap-6">
        <div className="w-md">
       <Card shadow="sm" padding="lg" radius="md" className="border border-primary-400">
      <Group justify="space-between" mb="md">
        <Text fw={600} size="lg">Agendamento #{idAppointment}</Text>
        
        <Badge color={appointments.status === "SCHEDULED" ? "green" : appointments.status === "CANCELLED" ? "red" : "yellow"}>
          {statusTranslations[appointments.status]}
        </Badge>
      </Group>

      <Divider mb="sm" label="Paciente" color="primary"  />
      <Stack gap={4}>
        <Group gap="xs">
          <IconUser size={16} />
          <Text>{appointments.patientName}</Text>
        </Group>
        <Group gap="xs">
          <IconPhone size={16} />
          <Text>{appointments.patientPhone ? appointments.patientPhone === '' ? null : '*Paciente sem telefone cadastrado*' : null}</Text>
        </Group>
        <Group gap="xs">
          <IconMail size={16} />
          <Text>{appointments.patientEmail}</Text>
        </Group>
      </Stack>

      <Divider my="sm" label="Médico" color="primary" />
      <Group gap="xs">
        <IconStethoscope size={16} />
        <Text>{appointments.doctorName}</Text>
      </Group>

      <Divider my="sm" label="Detalhes do Agendamento" color="primary" />
      <Stack gap={4}>
        <Group gap="xs">
          <IconCalendar size={16} />
          <Text>{dayjs(appointments.appointmentTime).format("DD/MM/YYYY")}</Text>
        </Group>
        <Group gap="xs">
          <IconClock size={16} />
          <Text>{dayjs(appointments.appointmentTime).format("HH:mm")}</Text>
        </Group>
        <Group gap="xs">
          <IconNotes size={16} />
          <Text fw={500}>Motivo:</Text>
          <Text>{appointments.reason}</Text>
        </Group>
        {appointments.notes && (
          <Group gap="xs" align="flex-start">
            <IconNotes size={16} />
            <Text c="dimmed" size="sm">{appointments.notes}</Text>
          </Group>
        )}
      </Stack>
    </Card>
          </div>
        <Tabs defaultValue="medical" variant="pills">
      <Tabs.List>
        <Tabs.Tab value="medical" leftSection={<IconMedicalCrossCircle size={12} />}>
          Histórico Médico
        </Tabs.Tab>
        <Tabs.Tab value="prescriptions" leftSection={<IconVaccine size={12}/>}>
          Prescrição médica
        </Tabs.Tab>
        <Tabs.Tab value="reports" leftSection={<IconReportMedical size={12} />}>
          Relatório médico
        </Tabs.Tab>
      </Tabs.List>
        <Divider my="md"/>
      <Tabs.Panel value="medical">
        Gallery tab content
      </Tabs.Panel>

      <Tabs.Panel value="prescriptions">
        <Prescriptions appointment={appointments}/>
      </Tabs.Panel>

      <Tabs.Panel value="reports">
        <ApReport appointment={appointments}/>
      </Tabs.Panel>
    </Tabs>
        </div>
    </div>
      
    
  )
}

export default AppointmentDetails