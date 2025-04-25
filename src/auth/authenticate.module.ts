import { Module } from '@nestjs/common';
import { AuthenticateController } from './authenticate.controlller';

@Module({
  imports: [],
  controllers: [AuthenticateController],
  providers: [],
})
export class AuthenticateModule {}
