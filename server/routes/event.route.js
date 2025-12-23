import express from "express"
import { createEvent, getAllEvent, getEventById } from "../controllers/event.controller.js";
import { authoriseOrganizer, protect } from "../middlewares/auth.middleware.js";
import { upload } from "../config/cloudinary.js";

const router=express.Router();

router.post("/createEvent",protect,authoriseOrganizer,upload.single("bannerImage"),createEvent);
router.get("/getAllEvent",getAllEvent)
router.get("/getEventById/:eventId",getEventById)
export default router