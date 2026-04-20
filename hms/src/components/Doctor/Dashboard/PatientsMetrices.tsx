import { AreaChart } from "@mantine/charts";

const PatientsMetrices = () => {
  const getSum = (data: any[], key: string) => {
    return data.reduce((sum, item) => sum + item[key] || 0, 0);
  }
  const data = [
    { date: "Jan", pacientes: 10 },
    { date: "Fev", pacientes: 15 },
    { date: "Mar", pacientes: 8 },
    { date: "Abr", pacientes: 20 },
    { date: "Mai", pacientes: 12 },
    { date: "Jun", pacientes: 18 },
    { date: "Jul", pacientes: 25 },
    { date: "Ago", pacientes: 22 },
    { date: "Set", pacientes: 30 },
    { date: "Out", pacientes: 28 },
    { date: "Nov", pacientes: 35 },
    { date: "Dez", pacientes: 40 }
  ]
  return (
    <div className="flex h-full flex-col justify-between bg-violet-50 rounded-xl border border-orange-200 shadow-md">
      <div className="flex justify-between p-5 items-center">
        <div>
          <div className="font-semibold">Pacientes</div>
          <div className="text-sm text-gray-400">{new Date().getFullYear()}</div>
        </div>
        <div className="font-semibold text-2xl text-orange-500">
          {getSum(data, "pacientes")}
        </div>
      </div>
      <AreaChart
        h={200}
        data={data}
        dataKey="date"
        withGradient
        fillOpacity={0.7}
        series={[{ name: "pacientes", color: "orange" }]}
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
