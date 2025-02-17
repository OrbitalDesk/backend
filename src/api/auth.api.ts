import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

//import { apiKeyMiddleware } from '../middleware/apiKeyMiddleware';

const prisma = new PrismaClient();
const router = Router();



// Reference Route // Only For Me.
router.get('/clients', apiKeyMiddleware, async (req, res) => {
  const clients = await prisma.client.findMany();
  res.json(clients);
});

export default router;
