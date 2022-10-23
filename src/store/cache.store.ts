import { BadRequestException } from '@nestjs/common';
import { StorageEntity } from 'src/entities/StorageEntity';
import { Store } from './Store';

export class Cache<T extends StorageEntity<any>> extends Store<T> {
  private cacheStore: Record<string, T>;

  constructor() {
    super();
    this.cacheStore = {};
  }

  get(key: string): T {
    return this.cacheStore[key];
  }

  put(key: string, value: T): T {
    console.debug(Cache.name, key, value);
    if (this.cacheStore[key] !== undefined) {
      console.debug(Cache.name, 'Already submitted', this.cacheStore[key]);
      throw new BadRequestException('Feedback already submitted');
    }
    Object.defineProperty(this.cacheStore, key, value);
    return this.cacheStore[key];
  }

  flush() {
    this.cacheStore = {};
  }
}
