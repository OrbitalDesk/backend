import express, { Request, Response, NextFunction } from "express";
import passport from "../passport";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
const router = express.Router();
const SECRET_KEY = process.env.JWT_SECRET || "secret";

// Middleware om token te controleren
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

// **Discord Login**
router.get("/discord", passport.authenticate("discord"));
router.get(
  "/discord/callback",
  passport.authenticate("discord", { failureRedirect: "/" }),
  (req: Request, res: Response) => {
    const user = req.user as any;
    const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: "1h" });
    res.json({ message: "Discord login successful", token, user, redirectUrl: "/dashboard" }); // Voeg redirect toe
  }
);
// **GitHub Login**
router.get("/github", passport.authenticate("github"));
router.get(
  "/github/callback",
  passport.authenticate("github", { failureRedirect: "/" }),
  (req: Request, res: Response) => {
    const user = req.user as any;
    const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: "1h" });
    res.json({ message: "GitHub login successful", token, user, redirectUrl: "/dashboard" }); // Voeg redirect toe
  }
);

// **Email Register**
router.post("/register", async (req: Request, res: Response) => {
  const { email, password, firstName, lastName } = req.body;

  if (!email || !password) {
    res.status(400).json({ error: "Email and password are required" });
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: { email, password: hashedPassword, firstName, lastName, oauthProvider: "email" },
    });

    const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: "1h" });
    res.json({ message: "User registered", token, user });
  } catch (error) {
    res.status(400).json({ error: "User already exists" });
  }
});

// **Email Login**
router.post("/login", passport.authenticate("local"), (req: Request, res: Response) => {
  const user = req.user as any;
  const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: "1h" });
  res.json({ token, user, redirectUrl: "/dashboard" }); 
});

// **Protected route (User Info)**
router.get("/me", isAuthenticated, async (req: Request, res: Response) => {
  const userId = (req as any).user?.userId;
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  res.json({ user });
});

// **Logout**
router.get("/logout", (req: Request, res: Response, next: NextFunction) => {
  req.logout((err) => {
    if (err) return next(err);
    res.json({ message: "Logged out" });
  });
});

export default router;
