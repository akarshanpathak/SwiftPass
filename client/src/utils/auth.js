export const setUser=(user,token)=>{
    localStorage.setItem("user",JSON.stringify(user));
    localStorage.setItem("token",token)
    // console.log(JSON.stringify(user));
}

export const getUser=()=>{
    return JSON.parse(localStorage.getItem("user"))
}



export const logout=()=>{
    localStorage.removeItem("user")
}