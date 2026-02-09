import { Hono } from "hono";
import { moduleRouteSchema } from "./module.schema";
import { moduleService } from "./module.service";
import { route } from "@/utils/open-api";

export const moduleRoutes = new Hono().on(
    ...route("GET /", moduleRouteSchema),
    async (c) => {
        const input = c.req.valid("json");

        return c.json(await moduleService.findAll(input));
    },
);
