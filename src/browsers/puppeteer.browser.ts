import { NotImplementedException } from '@nestjs/common';
import puppeteer, { Page } from 'puppeteer';

import { Browser, Dimensions } from '../utilities';

export class PuppeteerBrowser extends Browser {
  openPage: Page;

  async launch(): Promise<void> {
    const browser = await puppeteer.launch({ headless: true });
    this.openPage = await browser.newPage();
  }

  async open(htmlOrUrl: URL | string) {
    if (htmlOrUrl instanceof URL) {
      throw new NotImplementedException();
    }
    await this.openPage.setContent(htmlOrUrl);
  }

  async capture(filepath: string, dimensions: Dimensions): Promise<string> {
    await this.openPage.screenshot({
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
}
