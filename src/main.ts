import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Application } from './platform';

async function bootstrap() {
  const server = await NestFactory.create(AppModule);
  const logger = new Logger();
  server.useLogger(logger);
  const app = await Application.getInstance(logger);
  const port = app.getRunningPort();
  await server.listen(port, () => {
    logger.verbose(`🚀 Server started on port ${port}`, 'ApplicationRoot');
  });
}
bootstrap();
