import { Test, TestingModule } from '@nestjs/testing';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthenticateController } from './authenticate.controlller';
import { Role } from './interfaces/role.enum';
import { User } from './interfaces/suthenticated-request';

describe('AuthenticateController', () => {
  let controller: AuthenticateController;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthenticateController],
      imports: [
        JwtModule.register({
          global: true,
          secret: 'test',
          signOptions: { expiresIn: '10000s' },
        }),
      ],
    }).compile();

    controller = module.get<AuthenticateController>(AuthenticateController);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should generate JWT token with given role with id 1 for admin', async () => {
    const role = Role.Admin;
    const token = await controller.generateToken(role);
    const user: User = await jwtService.verify(token);
    expect(user.id).toBe(1);
  });

  it('should generate JWT token with given role with id 2 for normal user', async () => {
    const role = Role.User;
    const token = await controller.generateToken(role);
    const user: User = await jwtService.verify(token);
    expect(user.id).toBe(2);
  });
});
