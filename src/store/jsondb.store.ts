import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Config, JsonDB } from 'node-json-db';

import { StorageEntity } from '../entities/StorageEntity';
import { Store } from './Store';

export class FileDB<E, T extends StorageEntity<E>> extends Store<T> {
  #db: JsonDB;

  constructor(dbName: string, private readonly ROOT_PATH = '/') {
    super();
    const config = new Config(`${dbName}.json`, true, true, ',', true);
    this.#db = new JsonDB(config);
  }

  async get(key: string): Promise<T> {
    const resource = (await this.#db.getData(key))[key] as Promise<T>;
    if (!resource) throw new NotFoundException('Resource with given id does not exist');
    return resource;
  }

  async putWithoutCheck(key: string, value: T) {
    await this.#db.push(this.ROOT_PATH, { [key]: value }, false);
    return value;
  }

  async put(key: string, value: T): Promise<T> {
    if (this.#db.exists(key)) throw new BadRequestException('Resource already exists');
    return this.putWithoutCheck(key, value);
  }

  async update(key: string, value: T): Promise<T> {
    await this.#db.delete(key);
    return this.putWithoutCheck(key, value);
  }

  flush() {
    this.#db.delete(this.ROOT_PATH);
  }
}
