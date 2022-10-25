import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DynamicImageRepository } from './repositories/dynamic-image.repository';
import { FeedbackRepository } from './repositories/feedback.repository';
import { DynamicImageService } from './services/dynamic-image.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, FeedbackRepository, DynamicImageRepository, DynamicImageService],
})
export class AppModule {}
