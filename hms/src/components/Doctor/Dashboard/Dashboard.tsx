import Appointments from "./Appointments"
import DiseaseCard from "./DiseaseCard"
import Metrices from "./Metrices"
import Patients from "./Patients"
import PatientsMetrices from "./PatientsMetrices"
import Welcome from "./Welcome"

const Dashboard = () => {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-5">
      <Welcome />
      <Metrices />
      </div>
      <div className="grid grid-cols-3 gap-5">
        <DiseaseCard />
        <div className="col-span-2">
        <PatientsMetrices />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-5">
          <Patients />
          <Appointments />
      </div>
    </div>
  )
}

export default Dashboard
