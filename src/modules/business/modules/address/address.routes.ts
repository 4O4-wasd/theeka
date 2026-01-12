import { Hono } from 'hono';
import { AddressService } from './address.service';

export const addressRoutes = new Hono();
const addressService = new AddressService();

addressRoutes.get('/', async (c) => {
  const address = await addressService.getAll();
  return c.json(address);
});
