import { ScrollArea } from "@mantine/core";
import { useEffect, useState } from "react";
import { getAllTodaysAppointments } from "../../../services/AppointmentService";
import { extractTime } from "../../../utilities/DateUtility";

const Appointments = () => {
  const [apData, setApData] = useState<any[]>([]);
  useEffect(() => {
    getAllTodaysAppointments().then((data) => {
      setApData(data);
    }).catch((error) => {
      console.error("Error fetching today's appointments:", error);
    });
  }, []);

  const card = (app: any) =>{
    return ( 
          <div className="mb-3 flex items-center justify-between gap-3 rounded-xl border border-violet-200/80 border-l-4 border-l-violet-500 bg-white/65 p-3 shadow-sm shadow-violet-950/5">
           <div>
              <div className="font-semibold">{app.patientName}</div>
              <div className="text-sm text-gray-500">Dr. {app.doctorName}</div>
           </div>
           <div className="text-right">
              <div className="text-sm text-gray-500">{extractTime(app.appointmentTime)}</div>
              <div className="text-sm text-gray-500">{app.reason}</div>
           </div>
          </div>
    )
  }
  
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-violet-200/70 bg-violet-100 p-3 shadow-lg shadow-violet-950/5">
      <div className="text-xl font-semibold ">Consultas de hoje</div>
      <div>
         <ScrollArea.Autosize mah={300} mx="auto">
        {apData.map((app) => card(app))}
      </ScrollArea.Autosize>
      </div>
    </div>
  );
};

export default Appointments;
