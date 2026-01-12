import { Hono } from 'hono';
import { ListingService } from './listing.service';

export const listingRoutes = new Hono();
const listingService = new ListingService();

listingRoutes.get('/', async (c) => {
  const listing = await listingService.getAll();
  return c.json(listing);
});
