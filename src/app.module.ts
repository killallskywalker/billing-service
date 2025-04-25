import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { BillingModule } from './billing-records/billing-records.module';
import { ConfigService } from '@nestjs/config';
import typeorm from './config/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AuthenticateModule } from './auth/authenticate.module';
import { JwtMiddleware } from './common/middleware/jwt.middleware';
import { BillingController } from './billing-records/billing-records.controller';
import { CacheModule } from '@nestjs/cache-manager';
import { LoggerModule } from 'nestjs-pino';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [typeorm],
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      global: true,
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN') || '3600s',
        },
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (
        configService: ConfigService,
      ): Promise<TypeOrmModuleOptions> => {
        const config = configService.get<TypeOrmModuleOptions>('typeorm');
        if (!config) {
          throw new Error('TypeORM configuration is missing');
        }
        return config;
      },
      inject: [ConfigService],
    }),
    LoggerModule.forRoot({
      pinoHttp: { enabled: process.env.NODE_ENV != 'test' },
    }),
    CacheModule.register(),
    BillingModule,
    AuthenticateModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).forRoutes(BillingController);
  }
}
