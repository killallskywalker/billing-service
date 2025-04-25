import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { ExceptionsFilter } from './common/filters/exceptions.filter';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useLogger(app.get(Logger));

  const config = new DocumentBuilder()
    .setTitle('Customer Billing')
    .setDescription('Customer Billing API')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api', app, documentFactory);

  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalFilters(new ExceptionsFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      enableDebugMessages: true,
      forbidUnknownValues: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap().catch((err) => {
  console.error('Failed to start app:', err);
});
