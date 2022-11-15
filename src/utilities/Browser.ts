import { Launchable } from '../interfaces';

export abstract class Browser implements Launchable {
  protected launched = false;
  abstract launch(): Promise<void>;
  abstract open(htmlOrUrl: string | URL): Promise<void>;
  abstract capture(filepath: string, dimensions: Dimensions): Promise<string>;

  static SINGLETON: Browser;

  static getInstance(Class: BrowserImplClass): Browser {
    if (Browser.SINGLETON == null) Browser.SINGLETON = new Class();
    return Browser.SINGLETON;
  }

  protected setLaunched(launched: boolean) {
    this.launched = launched;
  }

  isLaunched(): boolean {
    return this.launched;
  }
}

export interface Dimensions {
  height: number;
  width: number;
}

interface BrowserImplClass {
  new (): Browser;
}
