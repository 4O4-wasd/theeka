import { route } from "@/utils/open-api";
import { Hono } from "hono";
import { businessAddressRouteSchema } from "./business-address.schema";
import { businessAddressService } from "./business-address.service";

export const businessAddressRoutes = new Hono().on(
    ...route("GET /", businessAddressRouteSchema),
    async (c) => {
        const input = c.req.valid("json");

        return c.json(await businessAddressService.findAll(input));
    },
);
