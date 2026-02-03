import { generateOpenApiResponseFromSchema } from "@/utils/open-api";
import { Hono } from "hono";
import { describeRoute, validator } from "hono-openapi";
import { moduleRouteSchema } from "./module.schema";
import { moduleService } from "./module.service";

export const moduleRoutes = new Hono();

moduleRoutes.get(
    "/",
    describeRoute({
        description: "Find All",
        responses: generateOpenApiResponseFromSchema(
            moduleRouteSchema.findAll.response,
        ),
    }),
    validator("json", moduleRouteSchema.findAll.request.json),
    async (c) => {
        const input = c.req.valid("json");

        return c.json(await moduleService.findAll(input));
    },
);
