export type DashboardChartKey = "appointments" | "patients" | "doctors";

export interface DashboardChartPoint {
  month: string;
  total: number;
}

export interface DashboardChartConfig {
  id: DashboardChartKey;
  title: string;
  description: string;
  color: string;
  data: DashboardChartPoint[];
}

export interface DiseaseChartPoint {
  name: string;
  value: number;
  color: string;
}

export const appointmentsChartData: any[] = [
  { month: "Jan", appointments: 118 },
  { month: "Fev", appointments: 100 },
  { month: "Mar", appointments: 90 },
  { month: "Abr", appointments: 147 },
  { month: "Mai", appointments: 154 },
  { month: "Jun", appointments: 168 },
];

export const patientsChartData: any[] = [
  { month: "Jan", patients: 82 },
  { month: "Fev", patients: 87 },
  { month: "Mar", patients: 95 },
  { month: "Abr", patients: 104 },
  { month: "Mai", patients: 112 },
  { month: "Jun", patients: 121 },
];

export const doctorsChartData: any[] = [
  { month: "Jan", doctors: 14 },
  { month: "Fev", doctors: 15 },
  { month: "Mar", doctors: 16 },
  { month: "Abr", doctors: 18 },
  { month: "Mai", doctors: 19 },
  { month: "Jun", doctors: 21 },
];

export const diseaseChartData: DiseaseChartPoint[] = [
  { name: "Gripe", value: 38, color: "blue.6" },
  { name: "Diabetes", value: 24, color: "teal.6" },
  { name: "Hipertensao", value: 18, color: "orange.6" },
  { name: "Alergia", value: 12, color: "grape.6" },
  { name: "Asma", value: 8, color: "red.6" },
];

export const dashboardCharts: DashboardChartConfig[] = [
  {
    id: "appointments",
    title: "Consultas",
    description: "Consultas por mês",
    color: "indigo.6",
    data: appointmentsChartData,
  },
  {
    id: "patients",
    title: "Pacientes",
    description: "Novos pacientes por mês",
    color: "blue.6",
    data: patientsChartData,
  },
  {
    id: "doctors",
    title: "Médicos",
    description: "Doutores ativos por mês",
    color: "teal.6",
    data: doctorsChartData,
  },
];
