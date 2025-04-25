import { Controller, Get, Query } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiTags, ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { Role } from './interfaces/role.enum';

@ApiTags('Authenticate')
@Controller('authenticate')
export class AuthenticateController {
  constructor(private readonly jwtService: JwtService) {}

  @Get('generate')
  @ApiOperation({ summary: 'Generate a simple JWT token' })
  @ApiQuery({ name: 'role', description: 'User role', example: 'admin' })
  @ApiResponse({
    status: 200,
    description: 'JWT token as string',
    type: String,
  })
  async generateToken(@Query('role') role: Role): Promise<string> {
    const payload = { id: Role.Admin == role ? 1 : 2, role };
    return this.jwtService.sign(payload);
  }
}
