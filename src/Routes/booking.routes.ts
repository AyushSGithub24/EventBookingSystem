import  express from "express";
import { createBookings, deleteBookings, userBookings } from "../controllers/booking.controller";
import { authenticate } from "../controllers/Middleware";

const bookingRoute=express.Router();

bookingRoute.get("/me",authenticate,userBookings);

bookingRoute.post("/:eventId",authenticate,createBookings);

bookingRoute.delete("/:bookingId",authenticate,deleteBookings);

export default bookingRoute;
