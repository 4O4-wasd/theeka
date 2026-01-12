import { BusinessRepository } from './business.repository';

export class BusinessService {
  private repository: BusinessRepository;

  constructor() {
    this.repository = new BusinessRepository();
  }

  async getAll() {
    return await this.repository.getAll();
  }
}
