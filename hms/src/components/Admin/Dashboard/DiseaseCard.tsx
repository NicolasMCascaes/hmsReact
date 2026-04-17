import { DonutChart } from "@mantine/charts";
import { diseaseChartData } from "../../../data/DashboardData";

const DiseaseCard = () => {
  return (
    <div className="p-3 border rounded-xl bg-green-50 shadow-xl">
      <div className="text-xl font-semibold">Doenças comuns</div>
      <div className="flex justify-center">
        <DonutChart
          withLabelsLine
          labelsType="percent"
          withLabels
          data={diseaseChartData}
          chartLabel="Doenças comuns"
          thickness={25}
          size={200}
          paddingAngle={10}
        />
      </div>
    </div>
  );
};

export default DiseaseCard;
