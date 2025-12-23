import express from "express"
import { createEvent } from "../controllers/event.controller.js";
import { authoriseOrganizer, protect } from "../middlewares/auth.middleware.js";

const router=express.Router();

router.post("/createEvent",protect,authoriseOrganizer,createEvent);

export default router