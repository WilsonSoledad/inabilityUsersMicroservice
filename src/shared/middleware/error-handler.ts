import { Request, Response, NextFunction } from 'express';
import ResponseHandler from '../utils/response-handler';
import { AuthorizationError } from '../../application/errors/authorization.error';

export interface CustomError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export const errorHandler = (
  error: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
): Response => {
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Error interno del servidor';

  console.error('Error:', {
    message: error.message,
    stack: error.stack,
    statusCode,
    path: req.path,
    method: req.method,
  });

  if (error instanceof AuthorizationError) {
    return ResponseHandler.forbidden(res, error.message);
  }

  switch (statusCode) {
    case 400:
      return ResponseHandler.badRequest(res, message);
    case 401:
      return ResponseHandler.unauthorized(res, message);
    case 403:
      return ResponseHandler.forbidden(res, message);
    case 404:
      return ResponseHandler.notFound(res, message);
    case 409:
      return ResponseHandler.conflict(res, message);
    default:
      return ResponseHandler.internalError(res, message, error.stack);
  }
};

export const notFoundHandler = (req: Request, res: Response): Response => {
  return ResponseHandler.notFound(
    res,
    `Ruta ${req.method} ${req.url} no encontrada`
  );
};

export const asyncHandler = (
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export default { errorHandler, notFoundHandler, asyncHandler };
