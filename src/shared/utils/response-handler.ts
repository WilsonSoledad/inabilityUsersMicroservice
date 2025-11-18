import { Response } from 'express';

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  timestamp: string;
}

interface ApiError {
  success: boolean;
  message: string;
  error: string;
  timestamp: string;
  code: number;
}

export class ResponseHandler {
  static success<T>(
    res: Response,
    data: T,
    message: string = 'Operación exitosa',
    statusCode: number = 200
  ): Response {
    const response: ApiResponse<T> = {
      success: true,
      message,
      data,
      timestamp: new Date().toISOString(),
    };
    return res.status(statusCode).json(response);
  }

  static successNoData(
    res: Response,
    message: string = 'Operación exitosa',
    statusCode: number = 200
  ): Response {
    const response: ApiResponse = {
      success: true,
      message,
      timestamp: new Date().toISOString(),
    };
    return res.status(statusCode).json(response);
  }

  static error(
    res: Response,
    message: string,
    error: string = 'ERROR',
    statusCode: number = 500
  ): Response {
    const response: ApiError = {
      success: false,
      message,
      error,
      timestamp: new Date().toISOString(),
      code: statusCode,
    };
    return res.status(statusCode).json(response);
  }

  static badRequest(
    res: Response,
    message: string = 'Solicitud inválida'
  ): Response {
    return this.error(res, message, 'BAD_REQUEST', 400);
  }

  static unauthorized(
    res: Response,
    message: string = 'No autorizado'
  ): Response {
    return this.error(res, message, 'UNAUTHORIZED', 401);
  }

  static forbidden(
    res: Response,
    message: string = 'Acceso prohibido'
  ): Response {
    return this.error(res, message, 'FORBIDDEN', 403);
  }

  static notFound(
    res: Response,
    resource: string = 'Recurso'
  ): Response {
    return this.error(res, `${resource} no encontrado`, 'NOT_FOUND', 404);
  }

  static conflict(
    res: Response,
    message: string = 'Conflicto con el estado actual'
  ): Response {
    return this.error(res, message, 'CONFLICT', 409);
  }

  static internalError(
    res: Response,
    message: string = 'Error interno del servidor',
    details?: string
  ): Response {
    return this.error(res, message, details || 'INTERNAL_SERVER_ERROR', 500);
  }
}

export default ResponseHandler;
