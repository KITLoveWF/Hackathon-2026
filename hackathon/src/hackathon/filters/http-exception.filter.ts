import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';

export type AuthErrorKind =
  | 'auth_invalid_credentials'
  | 'auth_Invalid_refresh_TOken';

interface ErrorResponse {
  success: boolean;
  data: null;
  error: {
    message: string;
    code: AuthErrorKind;
    details: string | null;
  };
}

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    // Extract message from exception
    let message = 'Internal server error';
    if (
      typeof exceptionResponse === 'object' &&
      'message' in exceptionResponse
    ) {
      message = (exceptionResponse as any).message;
    } else if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
    }

    // Map status code to error code
    let errorCode: AuthErrorKind = 'auth_invalid_credentials';
    if (status === HttpStatus.UNAUTHORIZED) {
      errorCode = 'auth_invalid_credentials';
    } else if (status === HttpStatus.BAD_REQUEST) {
      errorCode = 'auth_invalid_credentials';
    }

    const errorResponse: ErrorResponse = {
      success: false,
      data: null,
      error: {
        message,
        code: errorCode,
        details: null,
      },
    };

    response.status(status).json(errorResponse);
  }
}
