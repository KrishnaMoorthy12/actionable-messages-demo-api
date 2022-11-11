export abstract class Store<T> {
  abstract get(key: string): T | Promise<T>;
  abstract put(key: string, value: T): T | Promise<T>;

  abstract flush(): void;
}
