import { AreaChart } from "@mantine/charts";

const Visits = () => {
  const getSum = (data: any[], key: string) => {
    return data.reduce((sum, item) => sum + item[key] || 0, 0);
  }
  const data = [
    { date: "Jan", visits: 10 },
    { date: "Fev", visits: 15 },
    { date: "Mar", visits: 8 },
    { date: "Abr", visits: 20 },
    { date: "Mai", visits: 12 },
    { date: "Jun", visits: 18 },
    { date: "Jul", visits: 25 },
    { date: "Ago", visits: 22 },
    { date: "Set", visits: 30 },
    { date: "Out", visits: 28 },
    { date: "Nov", visits: 35 },
    { date: "Dez", visits: 40 }
  ]
  return (
    <div className="flex flex-col justify-between bg-violet-50 rounded-xl border border-violet-200 shadow-md">
      <div className="flex justify-between p-5 items-center">
        <div>
          <div className="font-semibold">Visitas</div>
          <div className="text-sm text-gray-400">{new Date().getFullYear()}</div>
        </div>
        <div className="font-semibold text-2xl text-violet-500">
          {getSum(data, "visits")}
        </div>
      </div>
      <AreaChart
        h={150}
        data={data}
        dataKey="date"
        withGradient
        fillOpacity={0.7}
        series={[{ name: "visits", color: "violet" }]}
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
