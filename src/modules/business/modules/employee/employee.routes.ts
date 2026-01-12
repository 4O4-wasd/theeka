import { Hono } from 'hono';
import { EmployeeService } from './employee.service';

export const employeeRoutes = new Hono();
const employeeService = new EmployeeService();

employeeRoutes.get('/', async (c) => {
  const employee = await employeeService.getAll();
  return c.json(employee);
});
