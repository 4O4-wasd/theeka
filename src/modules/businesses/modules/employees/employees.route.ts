import { Hono } from "hono";
import { employeesRouteSchema } from "./employees.schema";
import { employeesService } from "./employees.service";
import { route } from "@/utils/open-api";

export const employeesRoutes = new Hono().on(
    ...route("GET /", employeesRouteSchema),
    async (c) => {
        const input = c.req.valid("json");

        return c.json(await employeesService.findAll(input));
    },
);
