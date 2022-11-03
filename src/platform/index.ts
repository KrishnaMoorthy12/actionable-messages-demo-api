import { Logger } from '@nestjs/common';
import * as TCPPorts from 'tcp-port-used';

export class Application {
  private static SINGLETON: Application;
  private logger: Logger;

  constructor(private readonly port: number, logger = new Logger()) {}

  public static async getInstance(logger?: Logger) {
    if (!this.SINGLETON) {
      const port = await Application.getAvailablePort();
      this.SINGLETON = new Application(port, logger);
    }

    return this.SINGLETON;
  }

  public static async getAvailablePort() {
    let port = +process.env.port || 3000;

    Logger.verbose(`Checking port ${port}`);

    while (await TCPPorts.check(port)) {
      port++;
      Logger.verbose(`Port ${port} is in use`);
    }

    return port;
  }

  public getRunningPort() {
    return this.port;
  }
}
