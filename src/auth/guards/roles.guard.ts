import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '../interfaces/role.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { AuthenticatedRequest } from '../interfaces/suthenticated-request';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      ctx.getHandler(),
      ctx.getClass(),
    ]);

    const request: AuthenticatedRequest = ctx.switchToHttp().getRequest();
    const user = request.user;
    const role = user.role;

    if (!requiredRoles) {
      return true;
    }

    return requiredRoles.includes(role);
  }
}
