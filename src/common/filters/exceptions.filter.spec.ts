import { Test, TestingModule } from '@nestjs/testing';
import { ExceptionsFilter } from './exceptions.filter';
import { HttpException, HttpStatus, BadRequestException } from '@nestjs/common';
import { ArgumentsHost } from '@nestjs/common/interfaces';
import { Response, Request } from 'express';

describe('ExceptionsFilter', () => {
  let exceptionsFilter: ExceptionsFilter;
  let mockResponse: Response;
  let mockRequest: Partial<Request>;

  beforeEach(async () => {
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    } as unknown as Response;
    mockRequest = {
      url: '/test-url',
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [ExceptionsFilter],
    }).compile();

    exceptionsFilter = module.get<ExceptionsFilter>(ExceptionsFilter);
  });

  it('should be defined', () => {
    expect(exceptionsFilter).toBeDefined();
  });

  it('should handle validation error (BadRequestException) with 422 status', () => {
    const validationErrors = {
      message: [
        'email must be an email',
        'password must be longer than 6 characters',
      ],
    };
    const exception = new BadRequestException(validationErrors);

    const host: ArgumentsHost = {
      switchToHttp: () => ({
        getResponse: () => mockResponse,
        getRequest: () => mockRequest,
      }),
    } as unknown as ArgumentsHost;

    exceptionsFilter.catch(exception, host);

    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      message: 'Validation failed',
      error: {
        email: ['must be an email'],
        password: ['must be longer than 6 characters'],
      },
    });
  });

  it('should handle HttpException with string message', () => {
    const exception = new HttpException(
      'Error message',
      HttpStatus.BAD_REQUEST,
    );

    const host: ArgumentsHost = {
      switchToHttp: () => ({
        getResponse: () => mockResponse,
        getRequest: () => mockRequest,
      }),
    } as unknown as ArgumentsHost;

    exceptionsFilter.catch(exception, host);

    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      message: 'Error message',
      error: { message: 'Error message' },
    });
  });

  it('should handle HttpException with object message', () => {
    const exceptionResponse = { message: 'Error object message' };
    const exception = new HttpException(
      exceptionResponse,
      HttpStatus.FORBIDDEN,
    );

    const host: ArgumentsHost = {
      switchToHttp: () => ({
        getResponse: () => mockResponse,
        getRequest: () => mockRequest,
      }),
    } as unknown as ArgumentsHost;

    exceptionsFilter.catch(exception, host);

    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      message: 'Error object message',
      error: exceptionResponse,
    });
  });

  it('should handle HttpException with array message', () => {
    const exceptionResponse = {
      message: ['Error message 1', 'Error message 2'],
    };
    const exception = new HttpException(
      exceptionResponse,
      HttpStatus.FORBIDDEN,
    );

    const host: ArgumentsHost = {
      switchToHttp: () => ({
        getResponse: () => mockResponse,
        getRequest: () => mockRequest,
      }),
    } as unknown as ArgumentsHost;

    exceptionsFilter.catch(exception, host);

    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      message: 'Error message 1, Error message 2',
      error: exceptionResponse,
    });
  });

  it('should handle generic Error (not HttpException)', () => {
    const error = new Error('Generic error message');

    const host: ArgumentsHost = {
      switchToHttp: () => ({
        getResponse: () => mockResponse,
        getRequest: () => mockRequest,
      }),
    } as unknown as ArgumentsHost;

    exceptionsFilter.catch(error, host);

    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      message: 'Generic error message',
      error: {
        name: 'Error',
        message: 'Generic error message',
        stack: expect.any(String) as string,
      },
    });
  });

  it('should exclude stack in production environment', () => {
    process.env.NODE_ENV = 'production';
    const error = new Error('Generic error message');

    const host: ArgumentsHost = {
      switchToHttp: () => ({
        getResponse: () => mockResponse,
        getRequest: () => mockRequest,
      }),
    } as unknown as ArgumentsHost;

    exceptionsFilter.catch(error, host);

    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      message: 'Generic error message',
      error: {
        name: 'Error',
        message: 'Generic error message',
        stack: undefined,
      },
    });
  });

  it('should include stack in non-production environment', () => {
    process.env.NODE_ENV = 'development';
    const error = new Error('Generic error message');

    const host: ArgumentsHost = {
      switchToHttp: () => ({
        getResponse: () => mockResponse,
        getRequest: () => mockRequest,
      }),
    } as unknown as ArgumentsHost;

    exceptionsFilter.catch(error, host);

    expect(mockResponse.json).toHaveBeenCalledWith({
      success: false,
      message: 'Generic error message',
      error: {
        name: 'Error',
        message: 'Generic error message',
        stack: expect.any(String) as string,
      },
    });
  });
});
