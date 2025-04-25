import { Test } from '@nestjs/testing';
import { Reflector } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';
import { RolesGuard } from './roles.guard';
import { Role } from '../interfaces/role.enum';
import { AuthenticatedRequest } from '../interfaces/suthenticated-request';

describe('RolesGuard', () => {
  let rolesGuard: RolesGuard;
  let reflector: Reflector;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        RolesGuard,
        {
          provide: Reflector,
          useValue: {
            getAllAndOverride: jest.fn(),
          },
        },
      ],
    }).compile();

    rolesGuard = moduleRef.get<RolesGuard>(RolesGuard);
    reflector = moduleRef.get<Reflector>(Reflector);
  });

  it('should be defined', () => {
    expect(rolesGuard).toBeDefined();
  });

  describe('canActivate', () => {
    let mockExecutionContext: ExecutionContext;
    let mockRequest: Partial<AuthenticatedRequest>;

    beforeEach(() => {
      mockRequest = {
        user: {
          id: 1,
          role: Role.User,
        },
      };

      mockExecutionContext = {
        getHandler: jest.fn(),
        getClass: jest.fn(),
        switchToHttp: jest.fn().mockReturnValue({
          getRequest: jest.fn().mockReturnValue(mockRequest),
        }),
      } as unknown as ExecutionContext;
    });

    it('should return true when no roles are required', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);

      const result = rolesGuard.canActivate(mockExecutionContext);

      expect(result).toBe(true);
    });

    it('should return true when user has required role', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([Role.User]);

      const result = rolesGuard.canActivate(mockExecutionContext);

      expect(result).toBe(true);
    });

    it('should return false when user does not have required role', () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([Role.Admin]);

      const result = rolesGuard.canActivate(mockExecutionContext);

      expect(result).toBe(false);
    });
  });
});
