// src/middleware/error.middleware.ts
import { Request, Response, NextFunction } from 'express';

export const errorMiddleware = (error: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Error caught by error middleware:', error);

  let status = error.statusCode || 500;
  let message = error.message || 'Internal Server Error';

  // TypeORM duplicate key hatası kontrolü
  if (error.code === '23505' || error.code === 'ER_DUP_ENTRY') {
    status = 409; // Conflict
    if (error.detail && error.detail.includes('email')) {
      message = 'Bu email adresi ile kayıtlı kullanıcı zaten mevcut.';
    } else if (error.detail && error.detail.includes('name')) {
      message = 'Bu isimde bir rol zaten mevcut.';
    } else {
      message = 'Bu kayıt zaten mevcut.';
    }
  }

  // Diğer veritabanı hataları için
  if (error.name === 'QueryFailedError') {
    status = 400;
    if (error.message.includes('duplicate key')) {
      status = 409;
      if (error.message.includes('email')) {
        message = 'Bu email adresi ile kayıtlı kullanıcı zaten mevcut.';
      } else if (error.message.includes('name')) {
        message = 'Bu isimde bir rol zaten mevcut.';
      } else {
        message = 'Bu kayıt zaten mevcut.';
      }
    }
  }

  res.status(status).json({ error: message });
};
