import { SetMetadata } from '@nestjs/common';
import { Roles, ROLES_KEY } from './roles.decorator';
import { Role } from '../interfaces/role.enum';

jest.mock('@nestjs/common', () => {
  const original: typeof import('@nestjs/common') =
    jest.requireActual('@nestjs/common');
  return {
    ...original,
    SetMetadata: jest.fn(),
  };
});

describe('Roles Decorator', () => {
  it('should call SetMetadata with correct key and roles', () => {
    const roles: Role[] = [Role.Admin, Role.User];

    Roles(...roles);

    expect(SetMetadata).toHaveBeenCalledWith(ROLES_KEY, roles);
  });
});
