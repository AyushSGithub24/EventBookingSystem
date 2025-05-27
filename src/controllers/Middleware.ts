import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken"
import { User } from "@prisma/client";
import dotenv from "dotenv";
dotenv.config();


export interface AuthenticatedRequest extends Request {
  user?: { userId: string; role: string };
}

export const generateToken = (user:Pick<User, "id" | "role">) => {
  const token = jwt.sign(
    { userId: user.id, role: user.role }, 
    process.env.JWT_SECRET!,
    { expiresIn: "1h" }
  );
  return token;
}



export const authenticate = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): any => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized - no token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      role: string;
    };

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};


export const requireRole = (allowedRoles: string[]) :any => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden - insufficient privileges" });
    }
    next();
  };
};