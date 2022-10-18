export abstract class Store<T> {
  abstract get(key: string): T;
  abstract put(key: string, value: T): T;
}
