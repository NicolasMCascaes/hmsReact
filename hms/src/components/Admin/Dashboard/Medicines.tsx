import { ScrollArea } from "@mantine/core";
import { useEffect, useState } from "react";
import { getAllMedicines } from "../../../services/MedicineService";

const Medicines = () => {
  const [medData, setMedData] = useState<any[]>([]);
  useEffect(() => {
    getAllMedicines().then((data) => {
      setMedData(data);
    }).catch((error) => {
      console.error("Error fetching medicines data:", error);
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
              <div className="text-sm text-gray-500">{app.stock}</div>
              <div className="text-sm text-gray-500">{app.manufacturer}</div>
           </div>
          </div>
    )
  }
  
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-orange-200/70 bg-orange-100 p-3 shadow-lg shadow-orange-950/5">
      <div className="text-xl font-semibold ">Medicamentos</div>
      <div>
         <ScrollArea.Autosize mah={300} mx="auto">
        {medData.map((app) => card(app))}
      </ScrollArea.Autosize>
      </div>
    </div>
  );
};

export default Medicines;
