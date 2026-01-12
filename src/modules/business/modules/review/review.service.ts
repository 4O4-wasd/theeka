import { ReviewRepository } from './review.repository';

export class ReviewService {
  private repository: ReviewRepository;

  constructor() {
    this.repository = new ReviewRepository();
  }

  async getAll() {
    return await this.repository.getAll();
  }
}
