import { Inject, Injectable } from '@nestjs/common';
import { IFeedback } from './entities/Feedback';
import { ILead } from './entities/Lead';
import { FeedbackRepository } from './repositories/feedback.repository';
import { LeadRepository } from './repositories/lead.repository';

@Injectable()
export class AppService {
  @Inject(FeedbackRepository) private feedbackRepo: FeedbackRepository;
  @Inject(LeadRepository) private leadRepo: LeadRepository;

  getHello(): string {
    return 'Hello World!';
  }

  saveFeedback(email: string, rating: number, message: string): IFeedback {
    return this.feedbackRepo.addFeedback({ from: email, rating, message });
  }

  checkIfUserHasSubmittedFeedback(email: string): boolean {
    return this.feedbackRepo.getFeedbackByEmail(email) !== null;
  }

  flushFeedbacks() {
    return this.feedbackRepo.flushDb();
  }

  addLead({ name, email, favorite_products }: ILead) {
    return this.leadRepo.addLead(name, email, favorite_products);
  }
}
