import { ScrollArea } from "@mantine/core";
import { getAllDoctors } from "../../../services/DoctorProfileService";
import { useEffect, useState } from "react";

const Doctors = () => {
  const [docData, setDocData] = useState<any[]>([]);
  useEffect(() => {
    getAllDoctors().then((data) => {
      setDocData(data);
    }).catch((error) => {
      console.error("Error fetching doctors data:", error);
    });
  }, []);


  const card = (app: any) =>{
    return ( 
          <div className="mb-3 flex items-center justify-between gap-3 rounded-xl border border-sky-200/80 border-l-4 border-l-sky-500 bg-white/70 p-3 shadow-sm shadow-sky-950/5">
           <div>
              <div className="font-semibold">{app.name}</div>
              <div className="text-sm text-gray-500">{app.email}</div>
           </div>
           <div className="text-right">
              <div className="text-sm text-gray-500">{app.location}</div>
              <div className="text-sm text-gray-500">{app.department}</div>
           </div>
          </div>
    )
  }
  
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-sky-200/70 bg-sky-100 p-3 shadow-lg shadow-sky-950/5">
      <div className="text-xl font-semibold ">Médicos</div>
      <div>
         <ScrollArea.Autosize mah={300} mx="auto">
        {docData.map((app) => card(app))}
      </ScrollArea.Autosize>
      </div>
    </div>
  );
};

export default Doctors;
