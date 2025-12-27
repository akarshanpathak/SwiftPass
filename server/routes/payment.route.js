import express from "express"
import { protect } from "../middlewares/auth.middleware.js"
import { createRazorpayOrder } from "../controllers/payment.controller.js"

const router=express.Router()

router.post("/createOrders/:eventId",protect,createRazorpayOrder )

export default router