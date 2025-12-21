import {createSlice} from "@reduxjs/toolkit"
import { jwtDecode } from "jwt-decode"
const UserSlice = createSlice({
    name: "user",
    initialState: localStorage.getItem("token")?jwtDecode(localStorage.getItem("token")|| ''):{},
    reducers:{
        setUser:(state, action) =>{
            
            state = action.payload
            return state
        },
        removeUser:(state)=>{
            state={}
            return state
        }
    }
    
})
export const {removeUser,setUser} = UserSlice.actions
export default UserSlice.reducer