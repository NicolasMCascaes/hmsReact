import { useEffect, useState } from "react"
import { getAllPatients } from "../../../services/PatientProfileService"
import PatientCard from "./PatientCard"

const Patients = () => {
    const [patients, setPatients] = useState<any[]>([])
    useEffect(() => {
        getAllPatients().then((response) => {
            setPatients(response)
        }).catch((error) => {
            console.log(error)
        })
    }, [])
  return (
    <div>
        <div className="text-xl text-primary-500 font-semibold">
            Pacientes
        </div>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t-2 border-primary-500 mt-2 pt-2">
            {patients.map((patient) => (
                <PatientCard
                    key={patient.idPatient}
                    name={patient.name}
                    email={patient.email}
                    dob={patient.dob}
                    phone={patient.phone}
                    address={patient.address}
                    bloodGroup={patient.bloodGroup}
                />
            ))}
        </div>
    </div>
  )
}

export default Patients