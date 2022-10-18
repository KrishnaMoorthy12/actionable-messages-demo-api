import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FeedbackRepository } from './repositories/feedback.repository';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, FeedbackRepository],
})
export class AppModule {}
