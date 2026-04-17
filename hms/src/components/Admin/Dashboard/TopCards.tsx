import { AreaChart } from "@mantine/charts";
import { appointmentsChartData, doctorsChartData, patientsChartData } from "../../../data/DashboardData";
import { ThemeIcon } from "@mantine/core";
import { IconFileReport, IconPhoto, IconUser } from "@tabler/icons-react";

const TopCards = () => {
  const getSum = (data: any[], key: string) => {
    return data.reduce((sum, item) => sum + item[key] || 0, 0);
  };
  const card = (name:string, id:string, color:string, bgColor:string, icon: React.ReactNode, data: any[]) =>{
    return ( <div className="">
          <div
            key={id}
            className={`rounded-2xl border  border-neutral-100 ${bgColor} p-4 shadow-sm`}
          >
            <div className="mb-4 flex items-end justify-between gap-3">
             
             <ThemeIcon color={color} size="xl" radius="md" className="shadow-xl">
                {icon}
            </ThemeIcon>
             <div className="flex flex-col items-end">
                <h3 className="text-lg font-semibold text-neutral-900">
                  {name}
                </h3>
                 <span className={"text-2xl font-semibold text-neutral-900"}>
                {getSum(data, id)}
              </span>
              </div>
            </div>
             
            <AreaChart
              h={115}
              data={data}
              dataKey="month"
              withGradient
              fillOpacity={0.70}
              series={[{ name: id, label: "Mês", color: color }]}
              curveType="bump"
              tickLine="none"
              strokeWidth={4}
              gridAxis="none"
              withDots={true}
              withXAxis={false}
              withYAxis={false}
              withLegend={false}
            />
          </div>
    </div>)
  }
  const cards = [
    {
      name: "Consultas",
      id: "appointments",
      color: "violet",
      bgColor: "bg-violet-100",
      icon: <IconFileReport style={{ width: '70%', height: '70%' }} />,
      data: appointmentsChartData
    },
    {
      name: "Pacientes",
      id: "patients",
      color: "green",
      bgColor: "bg-green-100",
      icon: <IconUser style={{ width: '70%', height: '70%' }} />,
      data: patientsChartData
    },
    {
      name: "Médicos",
      id: "doctors",
      color: "orange",
      bgColor: "bg-orange-100",
      icon: <IconPhoto style={{ width: '70%', height: '70%' }} />,
      data: doctorsChartData
    }
  ]
  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {cards.map((cardData) => card(cardData.name, cardData.id, cardData.color, cardData.bgColor, cardData.icon, cardData.data))}
    </div>
  );
};

export default TopCards;
