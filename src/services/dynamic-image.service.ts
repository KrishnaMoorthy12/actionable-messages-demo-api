import { Inject, Injectable, Logger } from '@nestjs/common';
import Deprecated from 'deprecated-decorator';
import * as moustache from 'mustache';
import fetch from 'node-fetch';
import * as path from 'path';
import { chromium } from 'playwright-chromium';
import puppeteer from 'puppeteer';

import { PuppeteerBrowser } from '../browsers';
import { Browser, Dimensions } from '../utilities';
import { IDynamicImage } from '../entities';
import { DynamicImageRepository } from '../repositories/dynamic-image.repository';

@Injectable()
export class DynamicImageService {
  @Inject(Logger) logger: Logger;
  constructor(@Inject(DynamicImageRepository) private repo: DynamicImageRepository) {}

  private async getCompiledHtml(component: string, apiEndPt: string, queryParams: URLSearchParams): Promise<string> {
    this.logger.debug(apiEndPt);
    const url = new URL(apiEndPt);
    url.search = queryParams.toString();

    const response = await (await fetch(url.href)).json();
    this.logger.debug(response, DynamicImageService.name);

    return moustache.render(component, response);
  }

  private getWrappedHtmlDoc(innerHtml: string, styles?: string, clientScript?: string): string {
    return `
      <html>
        <style>
          ${styles}
        </style>
        <body>
          ${innerHtml}
        </body>
        <script>
          ${clientScript}
        </script>
      </html>
    `;
  }

  /**
   * @deprecated use launchBrowserAndCapture instead
   */
  @Deprecated({ alternative: 'launchBrowserAndCapture' })
  private async takeScreenShot(html: string, filename: string, dimensions: IDynamicImage['dimensions']) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html);
    this.logger.debug('Page launched', DynamicImageService.name);
    const filepath = path.join(process.cwd(), 'static', filename);

    this.logger.debug({ filepath }, DynamicImageService.name);
    await page.screenshot({
      path: filepath,
      captureBeyondViewport: true,
      omitBackground: true,
      clip: {
        x: 0,
        y: 0,
        ...dimensions,
      },
    });
    return filepath;
  }

  /**
   * @deprecated use launchBrowserAndCapture instead
   */
  @Deprecated({ alternative: 'launchBrowserAndCapture' })
  private async takeScreenShotFromChrome(html: string, filename: string, dimensions: IDynamicImage['dimensions']) {
    const browser = await chromium.launch();
    const ctx = await browser.newContext();
    const page = await ctx.newPage();
    page.setContent(html);
    const filepath = path.join(process.cwd(), 'static', filename);
    await page.screenshot({
      clip: { ...dimensions, x: 0, y: 0 },
      omitBackground: true,
      path: filepath,
    });

    return filepath;
  }

  private async getHtmlPageFromTemplate(
    template: string,
    apiEndPoint: string,
    queryParams: URLSearchParams,
  ): Promise<string> {
    const compiledHtml = await this.getCompiledHtml(template, apiEndPoint, queryParams);
    this.logger.debug({ compiledHtml }, DynamicImageService.name);

    const html = this.getWrappedHtmlDoc(compiledHtml);
    this.logger.debug({ html }, DynamicImageService.name);
    return html;
  }

  private async launchBrowserAndCapture(html: string, screenshotPath: string, dimensions: Dimensions) {
    const browser = Browser.getInstance(PuppeteerBrowser);
    await browser.launch();
    await browser.open(html);
    return browser.capture(screenshotPath, dimensions);
  }

  async generateDynamicImage(id: string, params: Record<string, string>): Promise<string> {
    const { component, apiEndPt, dimensions } = await this.repo.getDynamicImageRecord(id);
    const html = await this.getHtmlPageFromTemplate(component, apiEndPt, new URLSearchParams(params));
    const filepath = path.join(process.cwd(), 'static', 'sample.png');

    this.logger.debug(`Screenshot saved to ${filepath}`, DynamicImageService.name);
    return this.launchBrowserAndCapture(html, filepath, dimensions);
  }

  createDynamicImg(diRecordDetails: IDynamicImage) {
    return this.repo.addDIRecordEntry(diRecordDetails);
  }

  flushDb() {
    this.logger.warn('Flushing the database...', DynamicImageService.name);
    return this.repo.flush();
  }
}
