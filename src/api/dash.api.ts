import express, { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET || "secret";

// Middleware to check token.
const isAuthenticated = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ error: "No token provided" });
    return;
  }

  const token = authHeader.split(" ")[1];
  jwt.verify(token, SECRET_KEY, (err, decoded: any) => {
    if (err) {
      res.status(401).json({ error: "Invalid token" });
      return;
    }
    (req as any).user = decoded; 
    next();
  });
};


// **Protected route (Admin Dashboard)**

router.get("/admin", isAuthenticated, async (req: Request, res: Response) => {
  const userId = (req as any).user?.userId;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  return

  //res.json({  });
});

// **Protected route (Freelancer Dashboard)**


router.get("/freelancer", isAuthenticated, async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId;
    if (!userId) {
      res.status(401).json({ error: "Unauthorized" });
      return;
    }
  
    return
  
    //res.json({  });
  });


// **Protected route (Client Dashboard)**


router.get("/client", isAuthenticated, async (req: Request, res: Response) => {
  const userId = (req as any).user?.userId;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  return

  //res.json({  });
});



export default router;
