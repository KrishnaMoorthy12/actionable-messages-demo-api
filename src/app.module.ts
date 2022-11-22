import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DynamicImageRepository, FeedbackRepository, LeadRepository } from './repositories';
import { DynamicImageService } from './services';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, FeedbackRepository, DynamicImageRepository, DynamicImageService, LeadRepository, Logger],
})
export class AppModule {}
