import Appointments from './Appointments'
import DiseaseCard from './DiseaseCard'
import Medication from './Medication'
import Visits from './Visits'
import Welcome from './Welcome'

const Dashboard = () => {
  return (
    <div className='grid gap-4'>
      <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-5">
        <Welcome />
        <Visits />
      </div>
      <div className='grid sm:grid-cols-1 lg:grid-cols-3 gap-5'>
        <DiseaseCard/>
        <Appointments/>
        <Medication/>
      </div>
    </div>
  )
}

export default Dashboard