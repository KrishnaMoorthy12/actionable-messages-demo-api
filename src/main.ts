import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Application } from './platform';

async function bootstrap() {
  const server = await NestFactory.create(AppModule);
  const app = await Application.getInstance();
  await server.listen(app.getRunningPort());
}
bootstrap();
