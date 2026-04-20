import { AreaChart } from "@mantine/charts";

const Metrices = () => {
  const getSum = (data: any[], key: string) => {
    return data.reduce((sum, item) => sum + item[key] || 0, 0);
  }
  const data = [
    { date: "2024-01-01", consultas: 10 },
    { date: "2024-01-02", consultas: 15 },
    { date: "2024-01-03", consultas: 8 },
    { date: "2024-01-04", consultas: 20 },
    { date: "2024-01-05", consultas: 12 },
    { date: "2024-01-06", consultas: 18 },
    { date: "2024-01-07", consultas: 25 }
  ]
  return (
    <div className="bg-violet-50 rounded-xl border border-neutral-200 shadow-md">
      <div className="flex justify-between p-5 items-center">
        <div>
          <div className="font-semibold">Consultas</div>
          <div className="text-sm text-gray-400">Últimos 7 dias</div>
        </div>
        <div className="font-semibold text-2xl text-violet-500">
          {getSum(data, "consultas")}
        </div>
      </div>
      <AreaChart
        h={115}
        data={data}
        dataKey="date"
        withGradient
        fillOpacity={0.7}
        series={[{ name: "consultas", color: "violet" }]}
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