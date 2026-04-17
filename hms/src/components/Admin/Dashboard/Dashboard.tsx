import DiseaseCard from "./DiseaseCard"
import TopCards from "./TopCards"

const Dashboard = () => {
  return (
    <div className="flex flex-col gap-5">
      <TopCards />
      <DiseaseCard />
    </div>
  )
}

export default Dashboard