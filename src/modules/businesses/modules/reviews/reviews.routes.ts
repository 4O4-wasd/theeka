import { Hono } from "hono";
import { reviewsRouteSchema } from "./reviews.schema";
import { reviewsService } from "./reviews.service";
import { route } from "@/utils/open-api";

export const reviewsRoutes = new Hono().on(
    ...route("GET /", reviewsRouteSchema),
    async (c) => {
        const input = c.req.valid("json");

        return c.json(await reviewsService.findAll(input));
    },
);
