import { AreaChart } from "@mantine/charts";
import { useEffect, useState } from "react";
import { getAppointmentCountByDoctorId } from "../../../services/AppointmentService";
import { useSelector } from "react-redux";
import { addZeroMonths } from "../../../utilities/OtherUtilities";

const Metrices = () => {
  const user = useSelector((state: any) => state.user);
  const [appointmentsData, setAppointmentsData] = useState<any[]>([]);
  useEffect(() => {
    getAppointmentCountByDoctorId(user.profileId).then((data) => {
      setAppointmentsData(data);
    }).catch((error) => {
      console.error("Error fetching appointment data:", error);
    });
  }, []);
  const getSum = (data: any[], key: string) => {
    return data.reduce((sum, item) => sum + item[key] || 0, 0);
  }
  return (
    <div className="bg-violet-50 rounded-xl border border-neutral-200 shadow-md">
      <div className="flex justify-between p-5 items-center">
        <div>
          <div className="font-semibold">Consultas</div>
          <div className="text-sm text-gray-400">{new Date().getFullYear()}</div>
        </div>
        <div className="font-semibold text-2xl text-violet-500">
          {getSum(appointmentsData, "count")}
        </div>
      </div>
      <AreaChart
        h={115}
        data={addZeroMonths(appointmentsData, "month", "count")}
        dataKey="month"
        withGradient
        fillOpacity={0.7}
        series={[{ name: "count", color: "violet" }]}
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

export default Metrices