import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { AppService } from './app.service';
import { IFeedback } from './entities/Feedback';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/feedback')
  submitFeedback(
    @Body() requestBody: IFeedback,
    @Query('from') email: string,
  ): IFeedback {
    return this.appService.saveFeedback(
      email,
      requestBody.rating,
      requestBody.message,
    );
  }

  @Get('/feedback/:email')
  isFeedbackSubmitted(@Param('email') email: string) {
    return this.appService.checkIfUserHasSubmittedFeedback(email);
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Delete('/feedback/actions/flush')
  flushFeedbacks() {
    return this.appService.flushFeedbacks();
  }
}
