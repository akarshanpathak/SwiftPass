import express from "express"
import dotenv from "dotenv"
import { connectDb } from "./config/db.js"
import cors from "cors"
import userRouter from "./routes/user.route.js"
import eventRouter from "./routes/event.route.js"
import errorMiddleware from "./middlewares/error.middleware.js"
import cookieParser from "cookie-parser"
dotenv.config()

const app=express()

connectDb()

app.use(express.json())
app.use(cors())
app.use(cookieParser())

//Routes
app.use("/api/v1/user",userRouter)
app.use("/api/v1/event",eventRouter)


app.use(errorMiddleware)
export default app;