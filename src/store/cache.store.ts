import { BadRequestException, NotFoundException } from '@nestjs/common';
import { StorageEntity } from '../entities/StorageEntity';
import { Store } from './Store';

export class Cache<T extends StorageEntity<any>> extends Store<T> {
  private cacheStore: Record<string, T>;

  constructor() {
    super();
    this.cacheStore = {};
  }

  get(key: string): T {
    const item = this.cacheStore[key];
    if (!item) throw new NotFoundException(`Item with key ${key} does not exist`);
    return item;
  }

  put(key: string, value: T): T {
    console.debug(Cache.name, key, value);
    if (this.cacheStore[key] !== undefined) {
      console.debug(Cache.name, 'Key already exist', this.cacheStore[key]);
      throw new BadRequestException('Key already exist');
    }
    this.cacheStore[key] = value;
    console.debug(`Inserted new record. DB: `, this.cacheStore);
    return this.cacheStore[key];
  }

  flush() {
    this.cacheStore = {};
  }
}
