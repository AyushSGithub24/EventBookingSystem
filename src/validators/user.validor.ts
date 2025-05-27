import { z } from "zod";
const ROLE = ["ADMIN", "USER"] as const;
export const signupSchema = z.object({
    email: z.string().email(),
    password: z.string()
        .min(8, { message: "Password must be at least 8 characters" })
        .max(20, { message: "Password must be less than 20 characters" })
        .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, {
            message: "Password must contain at least one special character",
        })
        .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
        .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
        .regex(/[0-9]/, { message: "Password must contain at least one number" }),
    name: z.string().max(24, { message: "Name must be less than 24 characters" })
        .min(2, { message: "Password must be at least 2 characters" })
        .optional(),
    role: z.enum(ROLE)
})


export const loginSchema = z.object({
    email: z.string().email(),
    password: z.string()
        .min(8, { message: "Password must be at least 8 characters" })
        .max(20, { message: "Password must be less than 20 characters" })
        .regex(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/, {
            message: "Password must contain at least one special character",
        })
        .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
        .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
        .regex(/[0-9]/, { message: "Password must contain at least one number" })
})


export const createEventSchema = z.object({
    title: z
        .string()
        .min(3, "Title must be at least 3 characters long")
        .max(100, "Title can't be more than 100 characters"),

    description: z
        .string()
        .min(10, "Description must be at least 10 characters")
        .max(1000, "Description can't be more than 1000 characters"),

    dateTime: z.coerce.date(),
    location: z
        .string()
        .min(3, "Location must be at least 3 characters")
        .max(200, "Location can't be more than 200 characters"),

    totalSeats: z
        .number({ invalid_type_error: "Total seats must be a number" })
        .int("Total seats must be an integer")
        .positive("Total seats must be greater than 0"),

})

export const updateEventSchema = z.object({
    title: z
        .string()
        .min(3, "Title must be at least 3 characters long")
        .max(100, "Title can't be more than 100 characters").optional(),

    description: z
        .string()
        .min(10, "Description must be at least 10 characters")
        .max(1000, "Description can't be more than 1000 characters").optional(),

    dateTime: z.coerce.date().optional(),
    location: z
        .string()
        .min(3, "Location must be at least 3 characters")
        .max(200, "Location can't be more than 200 characters").optional(),

    totalSeats: z
        .number({ invalid_type_error: "Total seats must be a number" })
        .int("Total seats must be an integer")
        .positive("Total seats must be greater than 0").optional(),
    availableSeats: z
        .number({ invalid_type_error: "Available seats must be a number" })
        .int("Available seats must be an integer")
        .nonnegative("Available seats must be 0 or more").optional(),
}) .refine(data => Object.keys(data).length > 0, {
    message: "At least one field must be provided for update",
});