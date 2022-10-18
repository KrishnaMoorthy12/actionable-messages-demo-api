import { Inject, Injectable } from '@nestjs/common';
import { IFeedback } from './entities/Feedback';
import { FeedbackRepository } from './repositories/feedback.repository';

@Injectable()
export class AppService {
  @Inject(FeedbackRepository) private feedbackRepo: FeedbackRepository;

  getHello(): string {
    return 'Hello World!';
  }

  saveFeedback(email: string, rating: number, message: string): IFeedback {
    return this.feedbackRepo.addFeedback({ from: email, rating, message });
  }

  checkIfUserHasSubmittedFeedback(email: string): boolean {
    return this.feedbackRepo.getFeedbackByEmail(email) !== null;
  }
}
