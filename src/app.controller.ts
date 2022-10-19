import { Body, Controller, Delete, Get, Post, Query } from '@nestjs/common';
import { AppService } from './app.service';
import { IFeedback } from './entities/Feedback';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/feedback')
  submitFeedback(
    @Body() requestBody: IFeedback,
    @Query('email') email: string,
  ): IFeedback {
    return this.appService.saveFeedback(
      email,
      requestBody.rating,
      requestBody.message,
    );
  }

  @Get('/feedback/actions/is-submitted')
  isFeedbackSubmitted(@Query('email') email: string) {
    const isSubmitted = this.appService.checkIfUserHasSubmittedFeedback(email);
    return { status: 'success', is_submitted: isSubmitted };
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Delete('/feedback/actions/flush')
  flushFeedbacks() {
    const count = this.appService.flushFeedbacks();
    return { status: 'deleted', count };
  }
}
