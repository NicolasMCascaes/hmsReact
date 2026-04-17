import {createSlice} from "@reduxjs/toolkit"
import { jwtDecode } from "jwt-decode"
type UserState = {
    id: string
    name: string
    sub: string
    roles: string
    profileId: number
    profilePictureId: number | null
}
const token = localStorage.getItem("token")
const initialState: UserState = token ? {...(jwtDecode(token) as Omit<UserState, "profilePictureId">),  profilePictureId: null } : {} as UserState
const UserSlice = createSlice({
    name: "user",
    initialState,
    
    reducers:{
        setUser:(_, action) => action.payload,
        removeUser:()=>({
            id:"",
            name:"" ,
            sub:"",
            roles:"",
            profileId:0,
            profilePictureId:null    
        }),
        setProfilePictureId:(state, action) => {
            state.profilePictureId = action.payload
        },
        updateUserData:(state, action) => ({
            ...state, ...action.payload
        })
    }
    
})
export const {removeUser,setUser,setProfilePictureId,updateUserData} = UserSlice.actions
export default UserSlice.reducer