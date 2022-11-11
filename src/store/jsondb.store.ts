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
    return (await this.#db.getData(key))[key] as Promise<T>;
  }

  async put(key: string, value: T): Promise<T> {
    await this.#db.push(this.ROOT_PATH, { [key]: value }, false);
    return value;
  }

  flush() {
    this.#db.delete(this.ROOT_PATH);
  }
}
