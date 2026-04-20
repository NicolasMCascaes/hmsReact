import { ScrollArea } from "@mantine/core";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getAllTodayAppointmentsByPatientId } from "../../../services/AppointmentService";
import { extractTime } from "../../../utilities/DateUtility";

const Appointments = () => {
  const user = useSelector((state: any) => state.user);
  const [appointments, setAppointments] = useState<any[]>([]);

  useEffect(() =>{
    getAllTodayAppointmentsByPatientId(user.profileId).then((response) => {
      setAppointments(response);
    }).catch((error) => {
      console.error(error);
    });
  },[]);
  const card = (app: any) =>{
    return ( 
          <div className="mb-3 flex items-center justify-between gap-3 rounded-xl border border-indigo-200/80 border-l-4 border-l-indigo-500 bg-white/65 p-3 shadow-sm shadow-violet-950/5">
           <div>
              <div className="font-semibold">{app.doctorName}</div>
              <div className="text-sm text-gray-500">{app.reason}</div>
           </div>
           <div className="text-right">
              <div className="text-sm text-gray-500">{extractTime(app.appointmentTime)}</div>
              
           </div>
          </div>
    )
  }
  
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-violet-200/70 bg-violet-100 p-3 shadow-lg shadow-violet-950/5">
      <div className="text-xl font-semibold ">Consultas de hoje</div>
      <div>
         <ScrollArea.Autosize mah={300} mx="auto">
        {appointments.length > 0 ? (
          appointments.map((app) => card(app))
        ) : (
          <div className="text-gray-500">Nenhuma consulta agendada para hoje.</div>
        )}
      </ScrollArea.Autosize>
      </div>
    </div>
  );
};

export default Appointments;
