import { Request, Response } from "express";
import bcrypt from "bcrypt"
import { PrismaClient } from "@prisma/client";
import { signupSchema, loginSchema } from "../validators/user.validor";
import { generateToken } from "./Middleware";


const client = new PrismaClient();

export const signup = async (req: Request, res: Response):Promise<any> => {
    //validation
    const parsedSignUp = signupSchema.safeParse(req.body);
    if (!parsedSignUp.success) {
        return res.status(400).json({ errors: parsedSignUp.error.flatten().fieldErrors });
    }
    const { email, password, name,role } = parsedSignUp.data;
    try {
        //check of existing user
        const existingUser = await client.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "Email already registered" });
        }
        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await client.user.create({
            data: {
                email,
                password: hashedPassword,
                name: name,
                role
            }
        })
        const newUser = { ...user, password: undefined };
        return res.status(201).json({ message: "User created successfully", newUser });
    } catch (error) {
        console.error("Error Registering user:", error);
        return res.status(500).json({ "message": "An error occurred while sign up", error })
    }
}


export const login = async (req: Request, res: Response): Promise<any> => {
    //validating user schema
    const parsedLogin = loginSchema.safeParse(req.body);
    if (!parsedLogin.success) {
        return res.status(400).json({ errors: parsedLogin.error.flatten().fieldErrors });
    }
    const { email, password } = parsedLogin.data;
    try {
        //check that user exist or not
        const user = await client.user.findUnique({ where: { email } })
        if (!user) {
            return res.status(400).json({ message: "User Does not exist please register" });
        }
        //validate password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(403).json({ message: "Invalid credentials" });
        }
        //return accesstoken
        const accessToken=generateToken(user);
        return res.status(200).json({"message":"User Login Succesfully ",accessToken})
    } catch (error) {
        console.error("Error Logging in user:", error);
        return res.status(500).json({ "message": "An error occurred while login ", error })
    }
}