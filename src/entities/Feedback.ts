import { randomUUID } from 'crypto';
import { StorageEntity } from './StorageEntity';

export class Feedback implements StorageEntity<IFeedback> {
  readonly id: string;
  constructor(
    private from: string,
    private rating: number,
    private message: string,
  ) {
    this.id = randomUUID();
  }

  getJSON(): IFeedback {
    return {
      from: this.from,
      rating: this.rating,
      message: this.message,
    };
  }
}

export interface IFeedback {
  from: string;
  rating: number;
  message: string;
}
