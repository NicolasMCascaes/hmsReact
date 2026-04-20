import { DonutChart } from "@mantine/charts";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { countByReasonAndPatientId } from "../../../services/AppointmentService";

const DiseaseCard = () => {
  const user = useSelector((state: any) => state.user);
  const [reasonsData, setReasonsData] = useState<any[]>([]);
  useEffect(() => {
    countByReasonAndPatientId(user.profileId).then((response) => {
      setReasonsData(response);
    }).catch((error) => {
      console.error(error);
    });
  }, [user.profileId]);
  const normalizeData = (data: any[]) => {
    const colors = ["teal.6", "orange.6", "blue.6", "green.6", "indigo.6", "violet.6", "pink.6"];
    return data.map((item, index) => ({
      name: item.reason,
      value: item.count,
      color: colors[index % colors.length]
    }));
  };


  return (
    <div className="flex h-full flex-col rounded-2xl border border-green-200/70 bg-green-50 p-3 shadow-lg shadow-green-950/5">
      <div className="text-xl font-semibold">Motivos comuns</div>
      <div className="flex flex-1 items-center justify-center">
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
