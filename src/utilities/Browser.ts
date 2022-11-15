import { Launchable } from '../interfaces';

export abstract class Browser implements Launchable {
  protected state = BrowserLifeCycleSates.DEAD;

  abstract launch(): Promise<void>;
  abstract open(htmlOrUrl: string | URL): Promise<void>;
  abstract capture(filepath: string, dimensions: Dimensions): Promise<string>;

  static SINGLETON: Browser;

  static getInstance(Class: BrowserImplClass): Browser {
    if (Browser.SINGLETON == null) Browser.SINGLETON = new Class();
    return Browser.SINGLETON;
  }

  isLaunched(): boolean {
    return this.state !== BrowserLifeCycleSates.DEAD;
  }
}

export interface Dimensions {
  height: number;
  width: number;
}

interface BrowserImplClass {
  new (): Browser;
}

export class IllegalBrowserStateException extends Error {
  constructor(currentState: BrowserLifeCycleSates, expectedState: BrowserLifeCycleSates, customMessage?: string) {
    super(
      customMessage || `Incorrect state of browser. Current state: ${currentState}, expected state: ${expectedState}`,
    );
  }
}

export enum BrowserLifeCycleSates {
  DEAD = 'dead',
  READY = 'ready',
  BUSY = 'busy',
  OPEN = 'open',
}
