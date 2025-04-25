import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';

interface ValidationErrorResponse {
  [field: string]: string[];
}

interface ErrorResponse {
  success: boolean;
  message: string;
  error: ValidationErrorResponse | Record<string, unknown>;
}

function isValidationResponse(obj: unknown): obj is { message: string[] } {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'message' in obj &&
    Array.isArray((obj as Record<string, unknown>).message)
  );
}

@Catch()
export class ExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let errorResponse: ValidationErrorResponse | Record<string, unknown> = {};

    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();

      // Handle class-validator validation errors
      if (
        exception instanceof BadRequestException &&
        isValidationResponse(exceptionResponse)
      ) {
        status = HttpStatus.UNPROCESSABLE_ENTITY;
        const validationMessages = exceptionResponse.message;
        const validationErrors: ValidationErrorResponse = {};

        validationMessages.forEach((msg: string) => {
          const [field, ...rest] = msg.split(' ');
          const formattedMessage = rest.join(' ').trim();

          if (!validationErrors[field]) {
            validationErrors[field] = [];
          }
          validationErrors[field].push(formattedMessage);
        });

        message = 'Validation failed';
        errorResponse = validationErrors;
      } else if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null &&
        'message' in exceptionResponse
      ) {
        const extractedMessage = (exceptionResponse as Record<string, unknown>)
          .message;

        if (typeof extractedMessage === 'string') {
          message = extractedMessage;
        } else if (Array.isArray(extractedMessage)) {
          message = extractedMessage.join(', ');
        }

        errorResponse = exceptionResponse as Record<string, unknown>;
        status = exception.getStatus();
      } else if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
        errorResponse = { message };
        status = exception.getStatus();
      }
    } else if (exception instanceof Error) {
      message = exception.message;
      errorResponse = {
        name: exception.name,
        message: exception.message,
        stack:
          process.env.NODE_ENV === 'production' ? undefined : exception.stack,
      };
    }

    const responseBody: ErrorResponse = {
      success: false,
      message,
      error: errorResponse,
    };

    response.status(status).json(responseBody);
  }
}
