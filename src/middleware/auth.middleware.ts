// src/middleware/auth.middleware.ts
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest, AuthenticatedUser } from '../interfaces/common.interface';
import config from '../core/config';
import { UserServices } from '../services/user.service';
import { RoleService } from '../services/role.service';

const secretKey = config.jwt.key; // Güvenli bir anahtar kullanmalısınız

export const authenticateToken = (allowedTypes: string[]) => {
  return async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: 'Unauthorized: Token not provided' });
    }

    const decoded = jwt.verify(token, secretKey);
    const { id, email } = decoded as AuthenticatedUser;
    const user = await UserServices.getUserById(id);
    const role = await RoleService.getRoleById(user.roleId);

    if (!allowedTypes.includes(role.name)) {
      return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
    }

    if (!user) {
      return res.status(401).json({ error: 'Unauthorized: User not found' });
    }

    req.user = { id, email } as AuthenticatedUser;
    next();
  };
};

export const authMiddleware = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: Token not provided' });
  }

  const decoded = jwt.verify(token, secretKey);
  const { id, email } = decoded as AuthenticatedUser;
  const user = await UserServices.getUserById(id);

  if (!user) {
    return res.status(401).json({ error: 'Unauthorized: User not found' });
  }

  req.user = { id, email } as AuthenticatedUser;
  next();
};
