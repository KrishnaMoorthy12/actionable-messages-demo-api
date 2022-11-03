import { BadRequestException, Inject, Logger, NotFoundException } from '@nestjs/common';
import { StorageEntity } from '../entities/StorageEntity';
import { Store } from './Store';

export class Cache<T extends StorageEntity<any>> extends Store<T> {
  private cacheStore: Record<string, T>;
  @Inject(Logger) private logger: Logger;

  constructor() {
    super();
    this.cacheStore = {};

    if (this.logger == undefined) {
      this.logger = new Logger();
    }
  }

  get(key: string): T {
    const item = this.cacheStore[key];
    if (!item) throw new NotFoundException(`Item with key ${key} does not exist`);
    return item;
  }

  put(key: string, value: T): T {
    this.logger.debug(JSON.stringify({ key, value }), Cache.name);
    if (this.cacheStore[key] !== undefined) {
      this.logger.debug(`Key already exist: ${this.cacheStore[key]}`, Cache.name);
      throw new BadRequestException('Key already exist');
    }
    this.cacheStore[key] = value;
    this.logger.debug(`Inserted new record. DB:  ${JSON.stringify(this.cacheStore)}`, Cache.name);
    return this.cacheStore[key];
  }

  flush() {
    this.cacheStore = {};
  }
}
