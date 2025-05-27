import express from "express"
import { authenticate, requireRole } from "../controllers/Middleware";
import { createEvent, deleteEvent, getAllEvents, getEvent, updateEvent } from "../controllers/event.controller";

const eventRoutes=express.Router();

eventRoutes.get("/",getAllEvents);

eventRoutes.get("/:id",getEvent);

eventRoutes.post("/", authenticate,requireRole(["ADMIN"])  ,createEvent);

eventRoutes.put("/:id", authenticate,requireRole(["ADMIN"])  ,updateEvent);

eventRoutes.delete("/:id", authenticate,requireRole(["ADMIN"])  ,deleteEvent);

export default eventRoutes;
