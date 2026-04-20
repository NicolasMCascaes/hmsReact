import { ScrollArea } from "@mantine/core";
import { patientsCardData } from "../../../data/DashboardData";

const Patients = () => {
  const card = (app: any) =>{
    return ( 
          <div className="mb-3 flex items-center justify-between gap-3 rounded-xl border border-rose-200/80 border-l-4 border-l-rose-500 bg-white/70 p-3 shadow-sm shadow-rose-950/5">
           <div>
              <div className="font-semibold">{app.name}</div>
              <div className="text-sm text-gray-500">{app.email}</div>
           </div>
           <div className="text-right">
              <div className="text-sm text-gray-500">{app.location}</div>
              <div className="text-sm text-gray-500">{app.bloodGroup}</div>
           </div>
          </div>
    )
  }
  
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-rose-200/70 bg-rose-100 p-3 shadow-lg shadow-rose-950/5">
      <div className="text-xl font-semibold ">Pacientes</div>
      <div>
         <ScrollArea.Autosize mah={300} mx="auto">
        {patientsCardData.map((app) => card(app))}
      </ScrollArea.Autosize>
      </div>
    </div>
  );
};

export default Patients;
