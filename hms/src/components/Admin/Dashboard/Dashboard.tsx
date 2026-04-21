import Appointments from "./Appointments"
import DiseaseCard from "./DiseaseCard"
import Doctors from "./Doctors"
import Medicines from "./Medicines"
import Patients from "./Patients"
import TopCards from "./TopCards"

const Dashboard = () => {
  return (
    <div className="flex flex-col gap-5">
      <TopCards />
      <div className="grid sm:grid-cols-1 lg:grid-cols-3 gap-5">
        <DiseaseCard />
        <Appointments />
        <Medicines />
      </div>
      <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-5">
        <Doctors />
        <Patients />
      </div>
      
    </div>
  )
}

export default Dashboard