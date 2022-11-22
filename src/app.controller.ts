import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Res } from '@nestjs/common';
import { Response } from 'express';
import { AppService } from './app.service';
import { IDynamicImage, IFeedback, ILead } from './entities';
import { DynamicImageService } from './services';

@Controller()
export class AppController {
  private static toggle = 0;
  private static IMAGES = ['./static/Logo.png', './static/ScreenShot.jpg'];
  constructor(private readonly appService: AppService, private readonly diService: DynamicImageService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/dicto')
  dicto(@Query() qp: Record<string, any>) {
    return qp;
  }

  @Post('/feedback')
  submitFeedback(@Body() requestBody: IFeedback, @Query('email') email: string): IFeedback {
    return this.appService.saveFeedback(email, requestBody.rating, requestBody.message);
  }

  @Get('/feedback/actions/is-submitted')
  isFeedbackSubmitted(@Query('email') email: string) {
    const isSubmitted = this.appService.checkIfUserHasSubmittedFeedback(email);
    return { status: 'success', is_submitted: isSubmitted };
  }

  @Delete('/feedback/actions/flush')
  flushFeedbacks() {
    const count = this.appService.flushFeedbacks();
    return { status: 'deleted', count };
  }

  @Get('/dynamic-image/toggle')
  getToggledImage(@Res() res: Response) {
    res.contentType(AppController.toggle == 0 ? 'png' : 'jpg');
    AppController.toggle = AppController.toggle == 0 ? 1 : 0;
    res.sendFile(AppController.IMAGES[AppController.toggle], {
      root: __dirname,
    });
  }

  @Post('/dynamic-image/actions/create')
  createDynamicImage(@Body() body: IDynamicImage) {
    return this.diService.createDynamicImg(body);
  }

  // we will forward the query params from our request to api
  @Get('/dynamic-image/:id')
  async getDynamicImage(
    @Param('id') diRecordId: string,
    @Query() queryParams: Record<string, string>,
    @Res() res: Response,
  ) {
    const diPath = await this.diService.generateDynamicImage(diRecordId, queryParams);
    res.contentType('png').sendFile(diPath);
  }

  @Delete('/dynamic-image/actions/flush')
  flushDynamicImagesDb() {
    this.diService.flushDb();
  }

  @Post('/lead')
  addLead(@Body() body: ILead) {
    return this.appService.addLead(body);
  }

  @Get('/lead')
  getLead(@Query('name') name: string) {
    return this.appService.getLead(name);
  }

  @Get('/lead/:name/favorite_products')
  async getFavoriteProducts(@Param('name') name: string) {
    const favs = await this.appService.getFavs(name);
    return { favorite_products: favs };
  }

  @Patch('/lead/:name/actions/update-favorites')
  updateFavorites(@Param('name') name: string, @Body('favorite_products') favorites: string[]) {
    return this.appService.updateFavs(name, favorites);
  }
}
