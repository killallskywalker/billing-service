import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request, Response, NextFunction } from 'express';
import { UnauthorizedException } from '@nestjs/common';
import {
  AuthenticatedRequest,
  User,
} from '../../auth/interfaces/suthenticated-request';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  use(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const token = req.headers['authorization']?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Not authenticate!');
    }

    try {
      const decoded: User = this.jwtService.verify(token);
      req['user'] = decoded;
      next();
    } catch (err) {
      throw new UnauthorizedException(err);
    }
  }
}
