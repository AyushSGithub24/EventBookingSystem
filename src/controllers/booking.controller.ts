import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthenticatedRequest } from "./Middleware";

const client = new PrismaClient();

export const userBookings = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
    const userId = req.user?.userId;
    if (!userId) {
        return res.status(401).json({ error: "Unauthorized access" });
    }
    try {
        const bookings = await client.booking.findMany({
            where: {
                userId: userId
            },
            include: {
                event: true // Include event details for each booking
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        return res.status(200).json({ bookings });
    } catch (error) {
        console.error("Error fetching user bookings:", error);
        return res.status(500).json({ error: "Failed to fetch bookings" });
    }

}

export const createBookings = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
    const userId = req.user?.userId;
    if (!userId) {
        return res.status(401).json({ error: "Unauthorized access" });
    }
    const {eventId}=req.params
    const { seats } = req.body;
    

    if (!eventId || !seats || seats <= 0) {
        return res.status(400).json({ error: "Invalid eventId or seat count" });
    }

    try {
        const result = await client.$transaction(async (tx) => {
            const event = await tx.event.findUnique({
                where: { id: eventId },
            });

            if (!event) {
                throw new Error("Event not found");
            }

            if (event.availableSeats < seats) {
                throw new Error("Not enough seats available");
            }

            const booking = await tx.booking.create({
                data: {
                    userId,
                    eventId,
                    seats
                },
            });

            await tx.event.update({
                where: { id: eventId },
                data: {
                    availableSeats: {
                        decrement: seats,
                    },
                },
            });

            return booking;
        });

        return res.status(201).json({ message: "Booking successful", booking: result });

    } catch (error: any) {
        console.error("Booking error:", error);
        return res.status(400).json({ error: error.message || "Booking failed" });
    }
};




export const deleteBookings = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
    const userId = req.user?.userId;
    const bookingId = req.params.bookingId;

    if (!userId) {
        return res.status(401).json({ error: "Unauthorized access" });
    }

    try {
        const result = await client.$transaction(async (tx) => {
            // Find the booking
            const booking = await tx.booking.findUnique({
                where: { id: bookingId },
                include: { event: true }
            });

            if (!booking) {
                throw new Error("Booking not found");
            }

            if (booking.userId !== userId) {
                throw new Error("You are not authorized to delete this booking");
            }

            // Delete the booking
            await tx.booking.delete({
                where: { id: bookingId }
            });

            // Restore the seats to the event
            await tx.event.update({
                where: { id: booking.eventId },
                data: {
                    availableSeats: {
                        increment: booking.seats
                    }
                }
            });

            return booking;
        });

        return res.status(200).json({ message: "Booking deleted successfully", booking: result });

    } catch (error: any) {
        console.error("Error deleting booking:", error);
        return res.status(400).json({ error: error.message || "Failed to delete booking" });
    }
};


