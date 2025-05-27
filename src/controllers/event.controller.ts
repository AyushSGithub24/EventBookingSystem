import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthenticatedRequest } from "./Middleware";
import { createEventSchema, updateEventSchema } from "../validators/user.validor";


const client = new PrismaClient();


export const getAllEvents = async (req: Request, res: Response): Promise<any> => {
    try {
        const events = await client.event.findMany();
        return res.status(200).json({ message: "Event fetched Succesfully ", events })
    } catch (error) {
        console.error("Error getting all events: ", error);
        return res.status(500).json({ "message": "An error occurred while getting all events " })
    }
}

export const getEvent = async (req: Request, res: Response): Promise<any> => {
    const eventId = req.params.id;
    if (!eventId) {
        return res.status(400).json({ message: "Event ID is required" });
    }
    try {
        const event = await client.event.findUnique({ where: { id: eventId } })
        if (!event) {
            return res.status(404).json({ message: "Event not found" });
        }

        return res.status(200).json({ message: "Event fetched Succesfully ", event })
    } catch (error) {
        console.error("Error getting  event: ", error);
        return res.status(500).json({ "message": "An error occurred while getting  event by id " })
    }
}


export const createEvent = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
    const userId = req.user?.userId;
    if (!userId) {
        return res.status(401).json({ error: "Unauthorized Accsess" });
    }
    const parsedCreateEvent = createEventSchema.safeParse(req.body);
    if (!parsedCreateEvent.success) {
        return res.status(400).json({ errors: parsedCreateEvent.error.flatten().fieldErrors });
    }
    const { title, description, dateTime, location, totalSeats } = parsedCreateEvent.data;
    try {
        const newEvent = await client.event.create({
            data: {
                title,
                description,
                dateTime,
                location,
                totalSeats,
                availableSeats: totalSeats,
                createdById: userId
            }
        })
        return res.status(201).json({ message: "Event created succesfully ", newEvent });
    } catch (error) {
        console.error("Error creating  event: ", error);
        return res.status(500).json({ "message": "An error occurred while creating  event", error })
    }
}


export const updateEvent = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
    const userId = req.user?.userId;
    if (!userId) {
        return res.status(401).json({ error: "Unauthorized Accsess" });
    }
    const eventId = req.params.id;
    const parsedUpdateEvent = updateEventSchema.safeParse(req.body);
    if (!parsedUpdateEvent.success) {
        return res.status(400).json({ errors: parsedUpdateEvent.error.flatten().fieldErrors });
    }
    const { title, description, dateTime, location, totalSeats, availableSeats } = parsedUpdateEvent.data;
    try {
        const existingEvent = await client.event.findFirst({
            where: {
                id: eventId,
                createdById: userId
            }
        });

        if (!existingEvent) {
            return res.status(403).json({ error: "Forbidden: You cannot update this event" });
        }
        const updateEvent = await client.event.update({
            where: {
                id: eventId,
            }, data: {
                title,
                description,
                dateTime,
                location,
                totalSeats,
                availableSeats:totalSeats
            }
        });

        return res.status(200).json({ message: "Event updated succesfully ", updateEvent });
    } catch (error) {
        console.error("Error updating  event: ", error);
        return res.status(500).json({ "message": "An error occurred while updating  event", error })
    }
}

export const deleteEvent = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
    const userId = req.user?.userId;
    if (!userId) {
        return res.status(401).json({ error: "Unauthorized Accsess" });
    }
    const eventId = req.params.id;
    try {
        const existingEvent = await client.event.findFirst({
            where: {
                id: eventId,
                createdById: userId
            }
        });
        if (!existingEvent) {
            return res.status(403).json({ error: "Forbidden: You cannot delete this event" });
        }
        const deleteEvent = await client.event.delete({
            where: {
                id: eventId
            }
        })
        return res.status(200).json({message: "Event Deleted succesfully "})
    } catch (error) {
        console.error("Error Deleting  event: ", error);
        return res.status(500).json({ "message": "An error occurred while Deleting  event", error })
    }
}
