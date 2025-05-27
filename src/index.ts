import  express from "express";
import dotenv from "dotenv";
dotenv.config();
import authRouter from "./Routes/auth.routes"
import eventRoutes from "./Routes/event.routes";
import bookingRoute from "./Routes/booking.routes";
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());


app.use("/v1/auth",authRouter)
app.use("/v1/events",eventRoutes)
app.use("/v1/bookings",bookingRoute)




app.listen(port, () => {console.log("Server is running on port " + port)})



