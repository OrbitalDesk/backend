"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiKeyMiddleware = void 0;
const API_KEY = process.env.API_KEY || 'ourapi';
const apiKeyMiddleware = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    if (apiKey !== API_KEY) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
    }
    next();
};
exports.apiKeyMiddleware = apiKeyMiddleware;
