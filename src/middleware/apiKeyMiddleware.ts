import { Request, Response, NextFunction } from 'express';

const API_KEY = process.env.API_KEY || 'ourapi'; 

export const apiKeyMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const apiKey = req.headers['x-api-key'];

  if (apiKey !== API_KEY) {
    
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  
  next();
};
