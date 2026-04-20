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

export interface AppointmentCardPoint {
  patient: string;
  doctor: string;
  time: string;
  reason: string;
}

export interface MedicineCardPoint {
  name: string;
  dosage: string;
  stock: string;
  manufacturer: string;
}

export interface DoctorCardPoint {
  name: string;
  email: string;
  location: string;
  department: string;
}

export interface PatientCardPoint {
  name: string;
  email: string;
  location: string;
  bloodGroup: string;
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

export const appointmentsCardData: AppointmentCardPoint[] = [
  {
    patient: "Ana Souza",
    doctor: "Dr. Carlos Lima",
    time: "08:30",
    reason: "Consulta de rotina",
  },
  {
    patient: "Bruno Ferreira",
    doctor: "Dra. Mariana Alves",
    time: "10:00",
    reason: "Retorno cardiologico",
  },
  {
    patient: "Camila Rocha",
    doctor: "Dr. Rafael Gomes",
    time: "11:20",
    reason: "Avaliacao de exames",
  },
  {
    patient: "Diego Martins",
    doctor: "Dra. Juliana Costa",
    time: "14:15",
    reason: "Sintomas gripais",
  },
  {
    patient: "Elaine Santos",
    doctor: "Dr. Pedro Nunes",
    time: "16:00",
    reason: "Acompanhamento de diabetes",
  },
];

export const medicinesCardData: MedicineCardPoint[] = [
  {
    name: "Paracetamol",
    dosage: "500mg",
    stock: "124 unidades",
    manufacturer: "Medley",
  },
  {
    name: "Amoxicilina",
    dosage: "875mg",
    stock: "68 unidades",
    manufacturer: "EMS",
  },
  {
    name: "Losartana",
    dosage: "50mg",
    stock: "210 unidades",
    manufacturer: "Neo Quimica",
  },
  {
    name: "Omeprazol",
    dosage: "20mg",
    stock: "96 unidades",
    manufacturer: "Cimed",
  },
  {
    name: "Ibuprofeno",
    dosage: "600mg",
    stock: "81 unidades",
    manufacturer: "Eurofarma",
  },
];

export const doctorsCardData: DoctorCardPoint[] = [
  {
    name: "Dr. Carlos Lima",
    email: "carlos.lima@hms.com",
    location: "Sala 201",
    department: "Cardiologia",
  },
  {
    name: "Dra. Mariana Alves",
    email: "mariana.alves@hms.com",
    location: "Sala 105",
    department: "Pediatria",
  },
  {
    name: "Dr. Rafael Gomes",
    email: "rafael.gomes@hms.com",
    location: "Sala 310",
    department: "Neurologia",
  },
  {
    name: "Dra. Juliana Costa",
    email: "juliana.costa@hms.com",
    location: "Sala 118",
    department: "Clinica Geral",
  },
  {
    name: "Dr. Pedro Nunes",
    email: "pedro.nunes@hms.com",
    location: "Sala 223",
    department: "Endocrinologia",
  },
];

export const patientsCardData: PatientCardPoint[] = [
  {
    name: "Ana Souza",
    email: "ana.souza@email.com",
    location: "Belo Horizonte",
    bloodGroup: "A+",
  },
  {
    name: "Bruno Ferreira",
    email: "bruno.ferreira@email.com",
    location: "Sao Paulo",
    bloodGroup: "O+",
  },
  {
    name: "Camila Rocha",
    email: "camila.rocha@email.com",
    location: "Curitiba",
    bloodGroup: "B+",
  },
  {
    name: "Diego Martins",
    email: "diego.martins@email.com",
    location: "Rio de Janeiro",
    bloodGroup: "AB-",
  },
  {
    name: "Elaine Santos",
    email: "elaine.santos@email.com",
    location: "Recife",
    bloodGroup: "O-",
  },
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
