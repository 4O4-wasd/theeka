import { generateOpenApiResponseFromSchema } from "@/utils/open-api";
import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
import type { BusinessContext } from "../../business.utils";
import { listingsRouteSchema } from "./listings.schema";

export const listingsRoutes = new Hono<{ Variables: BusinessContext }>();

listingsRoutes.get(
    "/",
    describeRoute({
        description: "Find All",
        responses: generateOpenApiResponseFromSchema(
            listingsRouteSchema.findAll.response,
        ),
    }),
    async (c) => {
        return c.json(c.get("business"));
    },
);
