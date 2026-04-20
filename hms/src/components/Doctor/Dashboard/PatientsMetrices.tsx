import { AreaChart } from "@mantine/charts";
import { useEffect, useState } from "react";
import { getRegistrationCounts } from "../../../services/UserService";
import { addZeroMonths } from "../../../utilities/OtherUtilities";

const PatientsMetrices = () => {
  const [patientsData, setPatientsData] = useState<any[]>([]);
  useEffect(() => {
    getRegistrationCounts().then((data) => {
      setPatientsData(data.patientCounts);
    }).catch((error) => {
      console.error("Error fetching registration counts:", error);
    });
  }, []);

  const getSum = (data: any[], key: string) => {
    return data.reduce((sum, item) => sum + item[key] || 0, 0);
  }

  return (
    <div className="flex h-full flex-col justify-between bg-violet-50 rounded-xl border border-orange-200 shadow-md">
      <div className="flex justify-between p-5 items-center">
        <div>
          <div className="font-semibold">Pacientes</div>
          <div className="text-sm text-gray-400">{new Date().getFullYear()}</div>
        </div>
        <div className="font-semibold text-2xl text-orange-500">
          {getSum(patientsData, "count")}
        </div>
      </div>
      <AreaChart
        h={200}
        data={addZeroMonths(patientsData, "month", "count")}
        dataKey="month"
        withGradient
        fillOpacity={0.7}
        series={[{ name: "count", color: "orange" }]}
        curveType="bump"
        tickLine="none"
        strokeWidth={4}
        gridAxis="none"
        withDots={false}
        withXAxis={false}
        withYAxis={false}
        withLegend={false}
      />
    </div>
  )
}

export default PatientsMetrices
