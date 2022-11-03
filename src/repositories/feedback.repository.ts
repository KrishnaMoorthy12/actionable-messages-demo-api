import { BadRequestException, Inject, Injectable, Logger } from '@nestjs/common';
import { Feedback, IFeedback } from '../entities/Feedback';
import { Cache } from '../store/cache.store';

@Injectable()
export class FeedbackRepository {
  private db: Cache<Feedback>;
  private email_idMap: Map<string, string>;
  @Inject(Logger) private logger: Logger;

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
      this.logger.debug('Already submitted', FeedbackRepository.name);
      throw new BadRequestException('Feedback already submitted');
    }

    const feedback = new Feedback(given.from, given.rating, given.message);
    this.db.put(feedback.id, feedback);
    this.email_idMap.set(given.from, feedback.id);
    return feedback.getJSON();
  }

  flushDb(): number {
    const count = Object.keys(this.email_idMap).length;
    this.logger.debug(`Deleting ${count} records from DB ...`, FeedbackRepository.name);
    this.db.flush();
    this.email_idMap.clear();
    return count;
  }
}
