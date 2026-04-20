import { AreaChart } from "@mantine/charts";
import { ThemeIcon } from "@mantine/core";
import { IconFileReport, IconPhoto, IconUser } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { countAllAppointmentsInCurrentYear } from "../../../services/AppointmentService";
import { getRegistrationCounts } from "../../../services/UserService";
import { addZeroMonths } from "../../../utilities/OtherUtilities";

const TopCards = () => {
  const [apData, setApData] = useState<any[]>([]);
  const [patientData, setPatientData] = useState<any[]>([]);
  const [doctorData, setDoctorData] = useState<any[]>([]);

  useEffect(() => {
    countAllAppointmentsInCurrentYear().then((data) => {
      setApData(data);
    }).catch((error) => {
      console.error("Error fetching appointment data:", error);
    });
    getRegistrationCounts().then((data) => {
      setPatientData(data.patientCounts);
      setDoctorData(data.doctorCounts);
    }).catch((error) => {
      console.error("Error fetching registration counts:", error);
    });
    
  }, []);
  const getSum = (data: any[], key: string) => {
    return data.reduce((sum, item) => sum + item[key] || 0, 0);
  };

  const renderChartTooltip = ({ active, label, payload }: any) => {
    if (!active || !payload?.length) {
      return null;
    }

    return (
      <div className="rounded-lg border border-neutral-200 bg-white px-3 py-2 shadow-sm">
        <div className="flex items-center gap-4 text-sm font-medium text-neutral-900">
          <span>{label}</span>
          <span>{payload[0]?.value}</span>
        </div>
      </div>
    );
  };

  const card = (
    name: string,
    id: string,
    color: string,
    bgColor: string,
    icon: React.ReactNode,
    data: any[]
  ) => {
    return (
      <div className="">
        <div
          key={id}
          className={`rounded-2xl border  border-neutral-100 ${bgColor} p-4 shadow-sm`}
        >
          <div className="mb-4 flex items-end justify-between gap-3">
            <ThemeIcon color={color} size="xl" radius="md" className="shadow-xl">
              {icon}
            </ThemeIcon>
            <div className="flex flex-col items-end">
              <div className="text-lg font-semibold text-neutral-900">{name}</div>
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
            fillOpacity={0.7}
            series={[{ name: id, color: color }]}
            curveType="bump"
            tickLine="none"
            strokeWidth={4}
            gridAxis="none"
            tooltipProps={{ content: renderChartTooltip }}
            withDots={true}
            withXAxis={false}
            withYAxis={false}
            withLegend={false}
          />
        </div>
      </div>
    );
  };

  const cards = [
    {
      name: "Consultas",
      id: "count",
      color: "violet",
      bgColor: "bg-violet-100",
      icon: <IconFileReport style={{ width: "70%", height: "70%" }} />,
      data: addZeroMonths(apData, "month", "count"),
    },
    {
      name: "Pacientes",
      id: "count",
      color: "green",
      bgColor: "bg-green-100",
      icon: <IconUser style={{ width: "70%", height: "70%" }} />,
      data: addZeroMonths(patientData, "month", "count"),
    },
    {
      name: "Médicos",
      id: "count",
      color: "orange",
      bgColor: "bg-orange-100",
      icon: <IconPhoto style={{ width: "70%", height: "70%" }} />,
      data: addZeroMonths(doctorData, "month", "count"),
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
      {cards.map((cardData) => {
      
        return card(
          cardData.name,
          cardData.id,
          cardData.color,
          cardData.bgColor,
          cardData.icon,
          cardData.data
        );
      })}
    </div>
  );
};

export default TopCards;
