import { DonutChart } from "@mantine/charts";
import { useEffect, useState } from "react";
import { countAllReasons } from "../../../services/AppointmentService";

const DiseaseCard = () => {
  const [reasonsData, setReasonsData] = useState<any[]>([]);
  useEffect(() => {
    countAllReasons().then((data) => {
      setReasonsData(data);
    }).catch((error) => {
      console.error("Error fetching reasons data:", error);
    });
  }, []);
  const normalizeData = (data: any[]) => {
    const colors = ["teal.6", "orange.6", "blue.6", "green.6", "indigo.6", "violet.6", "pink.6"];
    return data.map((item, index) => ({
      name: item.reason,
      value: item.count,
      color: colors[index % colors.length]
    }));
  };
  
  return (
    <div className="rounded-2xl border border-green-200/70 bg-green-50 p-3 shadow-lg shadow-green-950/5">
      <div className="text-xl font-semibold">Motivos comuns</div>
      <div className="flex justify-center">
        <DonutChart
          withLabelsLine
          labelsType="percent"
          withLabels
          data={normalizeData(reasonsData)}
          chartLabel="Motivos comuns"
          thickness={25}
          size={200}
          paddingAngle={10}
        />
      </div>
    </div>
  );
};

export default DiseaseCard;
