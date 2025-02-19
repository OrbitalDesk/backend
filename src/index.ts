import express from 'express';
import session from "express-session";
import { PrismaClient } from '@prisma/client';

import passport from "./passport";


import AdminApi from "./api/admin.api"
import AuthAPI from "./api/auth.api"
import UserApi from "./api/user.api"


const prisma = new PrismaClient();
const app = express();
const port = 3000;

app.use(express.json());
app.use(session({ secret: process.env.SESSION_SECRET!, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());

app.use('/api', AdminApi)
app.use("/auth", AuthAPI);
app.use("/profile", UserApi);



app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
