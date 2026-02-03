import { protectedMiddleware } from "@/middlewares/protected";
import { generateOpenApiResponseFromSchema } from "@/utils/open-api";
import { HTTP_STATUS } from "@/utils/status-codes";
import { Hono } from "hono";
import { describeRoute, validator } from "hono-openapi";
import { businessRouteSchema } from "./business.schema";
import { businessService } from "./business.service";

export const businessRoutes = new Hono().use(
    protectedMiddleware({ type: "user" }),
);

businessRoutes.get(
    "/",
    describeRoute({
        description: "Find All Businesses",
        responses: generateOpenApiResponseFromSchema(
            businessRouteSchema.findAll.response,
        ),
    }),
    async (c) => {
        const userId = c.get("user").id;
        const businesses = await businessService.findAll({ ownerId: userId });
        return c.json(businesses, HTTP_STATUS["OK"]);
    },
);

businessRoutes.post(
    "/",
    describeRoute({
        description: "Create a Business",
        responses: generateOpenApiResponseFromSchema(
            businessRouteSchema.create.response,
        ),
    }),
    validator("json", businessRouteSchema.create.request.json),
    async (c) => {
        const json = c.req.valid("json");
        const userId = c.get("user").id;
        const business = await businessService.create({
            ...json,
            ownerId: userId,
        });

        return c.json(business, HTTP_STATUS["Created"]);
    },
);

businessRoutes.get(
    "/:businessId",
    describeRoute({
        description: "Find A Business",
        responses: generateOpenApiResponseFromSchema(
            businessRouteSchema.find.response,
        ),
    }),
    validator("param", businessRouteSchema.find.request.param),
    async (c) => {
        const { businessId } = c.req.valid("param");
        const userId = c.get("user").id;
        const business = await businessService.find({
            id: businessId,
            ownerId: userId,
        });

        return c.json(business, HTTP_STATUS["OK"]);
    },
);

businessRoutes.patch(
    "/:businessId",
    describeRoute({
        description: "Update A Business",
        responses: generateOpenApiResponseFromSchema(
            businessRouteSchema.update.response,
        ),
    }),
    validator("param", businessRouteSchema.update.request.param),
    validator("json", businessRouteSchema.update.request.json),
    async (c) => {
        const { businessId } = c.req.valid("param");
        const json = c.req.valid("json");
        const userId = c.get("user").id;
        const business = await businessService.update({
            id: businessId,
            ownerId: userId,
            ...json,
        });

        return c.json(business, HTTP_STATUS["OK"]);
    },
);

businessRoutes.delete(
    "/:businessId",
    describeRoute({
        description: "Delete A Business",
        responses: generateOpenApiResponseFromSchema(
            businessRouteSchema.delete.response,
        ),
    }),
    validator("param", businessRouteSchema.delete.request.param),
    async (c) => {
        const { businessId } = c.req.valid("param");
        const userId = c.get("user").id;
        await businessService.delete({
            id: businessId,
            ownerId: userId,
        });

        return c.json(
            {
                success: true,
            },
            HTTP_STATUS["OK"],
        );
    },
);