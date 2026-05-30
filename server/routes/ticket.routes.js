import express from 'express'
import { protect } from '../middlewares/auth.middleware.js'
import { getAllticketOfuser, getTicketById } from '../controllers/ticket.controller.js'


const router = express.Router()

router.get("/getTicketById/:ticketId" , protect , getTicketById)
router.get("/getAllticketOfuser" , protect , getAllticketOfuser)

export default router