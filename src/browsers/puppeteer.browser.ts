import { NotImplementedException } from '@nestjs/common';
import puppeteer, { Page } from 'puppeteer';

import { Browser, BrowserLifeCycleSates, Dimensions, IllegalBrowserStateException } from '../utilities';

export class PuppeteerBrowser extends Browser {
  openPage: Page;

  async launch(): Promise<void> {
    const browser = await puppeteer.launch({ headless: true });
    this.openPage = await browser.newPage();
    this.state = BrowserLifeCycleSates.READY;
  }

  async open(htmlOrUrl: URL | string) {
    if (this.state !== BrowserLifeCycleSates.READY || !this.openPage) {
      throw new IllegalBrowserStateException(this.state, BrowserLifeCycleSates.READY);
    }
    if (htmlOrUrl instanceof URL) {
      throw new NotImplementedException();
    }
    await this.openPage.setContent(htmlOrUrl);
    this.state = BrowserLifeCycleSates.OPEN;
  }

  async capture(filepath: string, dimensions: Dimensions): Promise<string> {
    if (this.state !== BrowserLifeCycleSates.OPEN) {
      throw new IllegalBrowserStateException(this.state, BrowserLifeCycleSates.OPEN);
    }

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

    this.state = BrowserLifeCycleSates.READY;

    return filepath;
  }
}
