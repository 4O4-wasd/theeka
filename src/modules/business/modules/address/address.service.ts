import { AddressRepository } from './address.repository';

export class AddressService {
  private repository: AddressRepository;

  constructor() {
    this.repository = new AddressRepository();
  }

  async getAll() {
    return await this.repository.getAll();
  }
}
