import { ListingRepository } from './listing.repository';

export class ListingService {
  private repository: ListingRepository;

  constructor() {
    this.repository = new ListingRepository();
  }

  async getAll() {
    return await this.repository.getAll();
  }
}
