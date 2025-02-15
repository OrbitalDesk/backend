import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

import { apiKeyMiddleware } from '../middleware/apiKeyMiddleware';

const prisma = new PrismaClient();
const router = Router();

router.get('/users', apiKeyMiddleware, async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

router.get('/freelancesr', apiKeyMiddleware, async (req, res) => {
  const freelancers = await prisma.freelancer.findMany();
  res.json(freelancers);
});

router.get('/clients', apiKeyMiddleware, async (req, res) => {
  const clients = await prisma.client.findMany();
  res.json(clients);
});

export default router;