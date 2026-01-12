import { EmployeeRepository } from './employee.repository';

export class EmployeeService {
  private repository: EmployeeRepository;

  constructor() {
    this.repository = new EmployeeRepository();
  }

  async getAll() {
    return await this.repository.getAll();
  }
}
