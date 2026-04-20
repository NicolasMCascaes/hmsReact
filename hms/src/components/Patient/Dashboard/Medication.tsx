import { ScrollArea } from "@mantine/core";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getAllMedicinesByPatientId } from "../../../services/AppointmentService";

const Medication = () => {
  const user = useSelector((state: any) => state.user);
  const [medicines, setMedicines] = useState<any[]>([]);
  useEffect(() => {
    getAllMedicinesByPatientId(user.profileId).then((response) => {
      setMedicines(response);
    }).catch((error) => {
      console.error(error);
    });
  }, []);
  const card = (app: any) =>{
    return ( 
          <div className="mb-3 flex items-center justify-between gap-3 rounded-xl border border-orange-200/80 border-l-4 border-l-orange-500 bg-white/65 p-3 shadow-sm shadow-orange-950/5">
           <div>
              <div className="font-semibold">{app.name}</div>
              <div className="text-sm text-gray-500">{app.dosage}</div>
           </div>
           <div className="text-right">
              <div className="text-sm text-gray-500">{app.instructions}</div>
           </div>
          </div>
    )
  }
  
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-orange-200/70 bg-orange-100 p-3 shadow-lg shadow-orange-950/5">
      <div className="text-xl font-semibold ">Medicamentos</div>
      <div>
         <ScrollArea.Autosize mah={300} mx="auto">
        {medicines.map((app) => card(app))}
      </ScrollArea.Autosize>
      </div>
    </div>
  );
};

export default Medication;
