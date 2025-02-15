import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

import { apiKeyMiddleware } from '../middleware/apiKeyMiddleware';

const prisma = new PrismaClient();
const router = Router();

router.get('/users', apiKeyMiddleware, async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

export default router;