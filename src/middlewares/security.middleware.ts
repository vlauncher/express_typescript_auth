import { Request, Response, NextFunction } from 'express';

// Middleware to enforce HTTPS
export const enforceHttps = (req: Request, res: Response, next: NextFunction) => {
  if (req.headers['x-forwarded-proto'] !== 'https' && process.env.NODE_ENV === 'production') {
    return res.redirect(`https://${req.headers.host}${req.url}`);
  }
  next();
};
