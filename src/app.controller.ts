import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';
import { IFeedback } from './entities/Feedback';

@Controller()
export class AppController {
  private static toggle = 0;
  private static IMAGES = ['./static/Logo.png', './static/ScreenShot.jpg'];
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

  @Get('/dynamic-image')
  getDynamicImage(@Res() res: Response) {
    res.contentType(AppController.toggle == 0 ? 'png' : 'jpg');
    AppController.toggle = AppController.toggle == 0 ? 1 : 0;
    res.sendFile(AppController.IMAGES[AppController.toggle], {
      root: __dirname,
    });
  }

  @Delete('/feedback/actions/flush')
  flushFeedbacks() {
    const count = this.appService.flushFeedbacks();
    return { status: 'deleted', count };
  }
}
