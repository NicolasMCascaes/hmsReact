import { DonutChart } from "@mantine/charts";
import { diseaseChartData } from "../../../data/DashboardData";

const DiseaseCard = () => {
  return (
    <div className="rounded-2xl border border-green-200/70 bg-green-50 p-3 shadow-lg shadow-green-950/5">
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
