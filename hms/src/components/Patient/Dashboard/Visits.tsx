import { AreaChart } from "@mantine/charts";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { countAppointmentsByPatientId } from "../../../services/AppointmentService";
import { addZeroMonths } from "../../../utilities/OtherUtilities";

const Visits = () => {
  const user = useSelector((state: any) => state.user);
  const [visits, setVisits] = useState<any[]>([]);
  useEffect(() => {
    countAppointmentsByPatientId(user.profileId).then((response) => {
      console.log(response);
      setVisits(response);
    }).catch((error) => {
      console.error(error);
    });
  }, []);
    
  const getSum = (data: any[], key: string) => {
    return data.reduce((sum, item) => sum + item[key] || 0, 0);
  }
  return (
    <div className="flex flex-col justify-between bg-violet-50 rounded-xl border border-violet-200 shadow-md">
      <div className="flex justify-between p-5 items-center">
        <div>
          <div className="font-semibold">Visitas</div>
          <div className="text-sm text-gray-400">{new Date().getFullYear()}</div>
        </div>
        <div className="font-semibold text-2xl text-violet-500">
          {getSum(visits, "count")}
        </div>
      </div>
      <AreaChart
        h={150}
        data={addZeroMonths(visits, "month", "count")}
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

export default Visits
