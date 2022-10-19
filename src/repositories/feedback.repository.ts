import { BadRequestException, Injectable } from '@nestjs/common';
import { Feedback, IFeedback } from 'src/entities/Feedback';
import { Cache } from 'src/store/cache.store';

@Injectable()
export class FeedbackRepository {
  private db: Cache<Feedback>;
  private email_idMap: Map<string, string>;

  constructor() {
    this.db = new Cache<Feedback>();
    this.email_idMap = new Map<string, string>();
  }

  getDB(): Cache<Feedback> {
    return this.db;
  }

  getFeedback(id: string): IFeedback {
    return this.db.get(id)?.getJSON();
  }

  getFeedbackByEmail(email: string): IFeedback {
    if (!this.email_idMap.has(email)) return null;
    const id = this.email_idMap.get(email);
    return this.getFeedback(id);
  }

  addFeedback(given: IFeedback): IFeedback {
    if (this.email_idMap.has(given.from)) {
      console.debug(FeedbackRepository.name, 'Already submitted');
      throw new BadRequestException('Feedback already submitted');
    }

    const feedback = new Feedback(given.from, given.rating, given.message);
    this.db.put(feedback.id, feedback);
    this.email_idMap.set(given.from, feedback.id);
    return feedback.getJSON();
  }

  flushDb() {
    this.db.flush();
  }
}
