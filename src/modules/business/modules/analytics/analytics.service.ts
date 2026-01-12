import { AnalyticsRepository } from './analytics.repository';

export class AnalyticsService {
  private repository: AnalyticsRepository;

  constructor() {
    this.repository = new AnalyticsRepository();
  }

  async getAll() {
    return await this.repository.getAll();
  }
}
