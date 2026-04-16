import { useEffect, useState } from "react"
import { getAllDoctors } from "../../../services/DoctorProfileService"
import DoctorCard from "./DoctorCard"

interface Doctor {
    idDoctor: string
    name: string
    email: string
    dob: string | null
    phone: string | null
    address: string | null
    licenseNumber: string | null
    specialization: string | null
    department: string | null
    totalExp: number | null
}

const Doctors = () => {
    const [doctors, setDoctors] = useState<Doctor[]>([])

    useEffect(() => {
        getAllDoctors()
            .then((response) => {
                setDoctors(response)
            })
            .catch((error) => {
                console.log(error)
            })
    }, [])

    return (
        <div>
            <div className="text-xl text-primary-500 font-semibold">
                Medicos
            </div>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t-2 border-primary-500 mt-2 pt-2">
                {doctors.map((doctor) => (
                    <DoctorCard
                        key={doctor.idDoctor}
                        name={doctor.name}
                        email={doctor.email}
                        dob={doctor.dob}
                        phone={doctor.phone}
                        address={doctor.address}
                        licenseNumber={doctor.licenseNumber}
                        specialization={doctor.specialization}
                        department={doctor.department}
                        totalExp={doctor.totalExp}
                    />
                ))}
            </div>
        </div>
    )
}

export default Doctors
