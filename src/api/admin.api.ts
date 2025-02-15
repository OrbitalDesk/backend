import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const router = Router();

router.get('/users', async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

export default router;
