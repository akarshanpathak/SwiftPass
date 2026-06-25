import { createSlice } from "@reduxjs/toolkit";
import { setUser,getUser,logout } from "../utils/auth";
const initialState={
    currentUser:null,
    error:null,
    loading:false,
    currentLocation:null
}

const slice=createSlice({
    name:"user",
    initialState,
    reducers:{
        loginInstart:(state,action)=>{
            console.log("Sign in start");
            state.loading=true
            state.error=null
            state.currentUser=null
        },
        loginInSuccessFull:(state,action)=>{
            // console.log("in loginsuccessful " , action.payload)
            setUser(action.payload.user,action.payload.token)
            state.currentUser=action.payload.user
            state.loading=false;
            state.error=null
        },
        loginInFailed:(state,actions)=>{
            console.log("Sign in failed");
            state.loading=false
            state.error=actions.payload
            state.currentUser=null
        },
        logOutUser:(state,action)=>{
            // console.log("Log out start");
            state.currentUser=null
            state.error=null
            state.loading=false
            logout()
            // console.log("Log out successfull");
        },
        setCurrentLocation:(state,action)=>{
            state.currentLocation=action.payload
        }

    }
})

export const {loginInstart,logOutUser,loginInFailed,loginInSuccessFull,setCurrentLocation} =slice.actions

export default slice.reducer