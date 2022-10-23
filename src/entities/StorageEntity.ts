export interface StorageEntity<E> {
  id: string;
  getJSON(): E;
}
