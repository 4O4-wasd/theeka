import { Hono } from 'hono';
import { BusinessService } from './business.service';

export const businessRoutes = new Hono();
const businessService = new BusinessService();

businessRoutes.get('/', async (c) => {
  const business = await businessService.getAll();
  return c.json(business);
});
