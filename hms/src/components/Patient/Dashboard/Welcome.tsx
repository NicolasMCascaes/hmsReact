import { Avatar } from "@mantine/core"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { getDoctorProfile } from "../../../services/DoctorProfileService"
import { getPatientProfile } from "../../../services/PatientProfileService"
import { downloadMediaFile } from "../../../services/MediaService"
import { bloodGroups } from "../../../data/DropDownData"

const Welcome = () => {
    const user = useSelector((state: any) => state.user)
     const [avatarSrc, setAvatarSrc] = useState<string | null>(null)
     const [profileData, setProfileData] = useState<any>(null)

  useEffect(() => {
    const loadUserProfile = async () => {
      if (!user.profileId) {
        setAvatarSrc(null)
        return
      }
      const data = user.roles === 'DOCTOR'
        ? await getDoctorProfile(user.profileId)
        : await getPatientProfile(user.profileId)
      setProfileData(data)

      if (data.profilePictureId) {
        const imageBlob = await downloadMediaFile(data.profilePictureId)
        const reader = new FileReader()
        reader.onloadend = () => {
          setAvatarSrc(typeof reader.result === "string" ? reader.result : null)
        }
        reader.readAsDataURL(imageBlob)
        return
      }

      setAvatarSrc(null)
    }

    loadUserProfile()
  }, [user.profilePictureId, user.profileId, user.roles])
    return (
        <div className="p-5 border border-neutral-200 shadow-md rounded-xl bg-blue-50 flex flex-col gap-3">
            <div className="flex justify-between items-center">
                <div>
                    <div>Bem vindo de volta</div>
                    <div className="text-3xl font-semibold text-blue-600">{profileData?.name || user?.name}!</div>
                    <div>{bloodGroups[profileData?.bloodGroup || user?.bloodGroup]}, {profileData?.address || user?.address || 'Endereço não informado'}</div>
                </div>
                <Avatar src={avatarSrc || user?.avatar} size={100} alt={user?.name} />
            </div>
            <div className="flex gap-3">
                <div className="p-3 rounded-xl bg-violet-200 ">
                    <div className="text-sm text-gray-600">Visitas</div>
                    <div className="text-lg text-violet-600 font-semibold">120+</div>
                </div>
                 <div className="p-3 rounded-xl bg-orange-200 ">
                    <div className="text-sm text-gray-600">Medicamentos</div>
                    <div className="text-lg text-orange-600 font-semibold">80+</div>
                </div>
            </div>
        </div>
    )
}

export default Welcome