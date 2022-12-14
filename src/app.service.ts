import { Inject, Injectable } from '@nestjs/common';
import { IFeedback, ILead } from './entities';
import { FeedbackRepository, LeadRepository } from './repositories';

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

  getFavs(name: string): Promise<ILead['favorite_products']> {
    return this.leadRepo.getFavoriteProducts(name);
  }

  updateFavs(name: string, favs: string[]) {
    return this.leadRepo.updateFavoriteProducts(name, favs);
  }

  getLead(name: string): Promise<ILead> {
    return this.leadRepo.getLead(name);
  }
}
