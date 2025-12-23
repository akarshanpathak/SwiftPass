import dotenv from "dotenv"
import  app  from "./app.js"
dotenv.config()


const PORT=process.env.PORT

app.get("/",(req,res)=>{
    res.send("testing route")
    console.log("Home route");
})

app.listen(PORT || 3000,()=>{
    console.log(`Server is listening on the ${PORT}`);
    
})