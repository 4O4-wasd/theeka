import { Hono } from 'hono';
import { ReviewService } from './review.service';

export const reviewRoutes = new Hono();
const reviewService = new ReviewService();

reviewRoutes.get('/', async (c) => {
  const review = await reviewService.getAll();
  return c.json(review);
});
