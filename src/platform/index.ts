import * as TCPPorts from 'tcp-port-used';

export class Application {
  private static SINGLETON: Application;

  constructor(private readonly port: number) {}

  public static async getInstance() {
    if (!this.SINGLETON) {
      const port = await Application.getAvailablePort();
      this.SINGLETON = new Application(port);
    }

    return this.SINGLETON;
  }

  public static async getAvailablePort() {
    let port = +process.env.port || 3000;

    while (!(await TCPPorts.check(port))) {
      port++;
    }

    return port;
  }

  public getRunningPort() {
    return this.port;
  }
}
