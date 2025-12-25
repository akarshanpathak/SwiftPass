import express from "express"
import { changeEventStatus, createEvent, getAllEvent, getAllEventForUser, getEventById, updateEventsDetail } from "../controllers/event.controller.js";
import { authoriseOrganizer, protect } from "../middlewares/auth.middleware.js";
import { upload } from "../config/cloudinary.js";

const router=express.Router();

router.post("/createEvent",protect,authoriseOrganizer,upload.single("bannerImage"),createEvent);
router.get("/getAllEvent",getAllEvent)
router.get("/getEventById/:eventId",getEventById)
router.get("/getAllEventForUser",protect,getAllEventForUser)
router.patch("/updateEventsDetail/:eventId",protect,authoriseOrganizer,upload.single("bannerImage"),updateEventsDetail)
router.patch("/changeEventStatus/:eventId",protect,authoriseOrganizer,changeEventStatus)

export default router