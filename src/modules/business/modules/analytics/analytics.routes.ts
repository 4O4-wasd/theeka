import { Hono } from 'hono';
import { AnalyticsService } from './analytics.service';

export const analyticsRoutes = new Hono();
const analyticsService = new AnalyticsService();

analyticsRoutes.get('/', async (c) => {
  const analytics = await analyticsService.getAll();
  return c.json(analytics);
});
