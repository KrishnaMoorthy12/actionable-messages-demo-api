import { Inject, Injectable } from '@nestjs/common';
import * as moustache from 'mustache';
import fetch from 'node-fetch';
import * as path from 'path';
import { chromium } from 'playwright-chromium';
import puppeteer from 'puppeteer';
import { IDynamicImage } from '../entities/DynamicImage';

import { DynamicImageRepository } from '../repositories/dynamic-image.repository';

@Injectable()
export class DynamicImageService {
  constructor(@Inject(DynamicImageRepository) private repo: DynamicImageRepository) {}

  private async getCompiledHtml(
    component: string,
    apiEndPt: string,
    queryParams: URLSearchParams,
  ): Promise<string> {
    const url = new URL(apiEndPt);
    url.search = queryParams.toString();
    const response = await (await fetch(url.href)).json();
    console.debug(response);

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

  private async takeScreenShot(
    html: string,
    filename: string,
    dimensions: IDynamicImage['dimensions'],
  ) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(html);
    console.debug('Page launched');
    const filepath = path.join(process.cwd(), 'static', filename);

    console.debug({ filepath });
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

  private async takeScreenShotFromChrome(
    html: string,
    filename: string,
    dimensions: IDynamicImage['dimensions'],
  ) {
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

  async generateDynamicImage(id: string, params: Record<string, string>) {
    const { component, apiEndPt, dimensions } = this.repo.getDynamicImageRecord(id);
    const compiledHtml = await this.getCompiledHtml(
      component,
      apiEndPt,
      new URLSearchParams(params),
    );
    console.debug({ compiledHtml });
    const html = this.getWrappedHtmlDoc(compiledHtml);
    console.debug({ html });
    return this.takeScreenShotFromChrome(html, 'sample.png', dimensions);
  }

  createDynamicImg(diRecordDetails: IDynamicImage) {
    return this.repo.addDIRecordEntry(diRecordDetails);
  }
}
