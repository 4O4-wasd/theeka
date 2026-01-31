import { generateOpenApiResponseFromSchema } from "@/utils/generateOpenApiResponseFromSchema";
import { Hono } from "hono";
import { describeRoute, validator } from "hono-openapi";
import { businessRouteSchema } from "./business.schema";
import { businessService } from "./business.service";

export const businessRoutes = new Hono();

businessRoutes.get(
    "/",
    describeRoute({
        description: "Find All",
        responses: generateOpenApiResponseFromSchema(
            businessRouteSchema.findAll.response,
        ),
    }),
    validator("json", businessRouteSchema.findAll.request.json),
    async (c) => {
        const input = c.req.valid("json");

        return c.json(await businessService.findAll(input));
    },
);
