import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { UserRole } from '../../../domain/user.entity'; 

export interface AuthRequest extends Request {
  user?: { id: number; role: UserRole };
}


export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'denied access. no token provided.' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'denied access. invalid Token.' });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET is not defined in environment variables.');
    }

    const decoded = jwt.verify(token, secret);

    if (typeof decoded === 'object' && decoded !== null && 'id' in decoded && 'role' in decoded) {
      req.user = {
        id: (decoded as JwtPayload).id,
        role: (decoded as JwtPayload).role
      };
      next();
    } else {
      throw new jwt.JsonWebTokenError('payload token invalid');
    }
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: `Invalid Token: ${error.message}` });
    }
    return res.status(500).json({ message: (error as Error).message });
  }
};