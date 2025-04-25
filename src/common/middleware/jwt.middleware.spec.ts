import { JwtMiddleware } from './jwt.middleware';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { Response, NextFunction } from 'express';
import {
  AuthenticatedRequest,
  User,
} from '../../auth/interfaces/suthenticated-request';
import { Role } from '../../auth/interfaces/role.enum';

describe('JwtMiddleware', () => {
  let middleware: JwtMiddleware;
  let mockJwtService: Partial<JwtService>;

  const mockRequest = (header: string | undefined): AuthenticatedRequest =>
    ({
      headers: { authorization: header },
    }) as AuthenticatedRequest;

  const mockResponse = {} as Response;
  const mockNext = jest.fn() as NextFunction;

  beforeEach(() => {
    mockJwtService = {
      verify: jest.fn(),
    };

    middleware = new JwtMiddleware(mockJwtService as JwtService);
  });

  it('should throw if no token is provided', () => {
    const req = mockRequest(undefined);

    expect(() => middleware.use(req, mockResponse, mockNext)).toThrow(
      UnauthorizedException,
    );
  });

  it('should throw if token is invalid', () => {
    const req = mockRequest('Bearer invalid.token');
    (mockJwtService.verify as jest.Mock).mockImplementation(() => {
      throw new Error('invalid token');
    });

    expect(() => middleware.use(req, mockResponse, mockNext)).toThrow(
      UnauthorizedException,
    );
  });

  it('should decode token and call next()', () => {
    const req = mockRequest('Bearer valid.token');
    const decodedUser: User = { id: 1, role: Role.Admin };
    (mockJwtService.verify as jest.Mock).mockReturnValue(decodedUser);

    middleware.use(req, mockResponse, mockNext);

    expect(req.user).toEqual(decodedUser);
    expect(mockNext).toHaveBeenCalled();
  });
});
