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
      return res.status(401).json({ message: 'Acceso denegado. Token no proporcionado' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Acceso denegado. Token inválido' });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error('JWT_SECRET no está definido en las variables de entorno');
    }

    const decoded = jwt.verify(token, secret);

    if (typeof decoded === 'object' && decoded !== null && 'id' in decoded && 'role' in decoded) {
      req.user = {
        id: (decoded as JwtPayload).id,
        role: (decoded as JwtPayload).role
      };
      next();
    } else {
      throw new jwt.JsonWebTokenError('Payload del token inválido');
    }
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: `Token inválido: ${error.message}` });
    }
    return res.status(500).json({ message: (error as Error).message });
  }
};