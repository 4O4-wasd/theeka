import { protectedMiddleware } from "@/middlewares/protected";
import { generateOpenApiResponseFromSchema } from "@/utils/open-api";
import { HTTP_STATUS } from "@/utils/status-codes";
import { Hono } from "hono";
import { describeRoute, validator } from "hono-openapi";
import { businessesRouteSchema } from "./businesses.schema";
import { businessesService } from "./businesses.service";
import { businessMiddleware } from "./businesses.utils";
import { listingsRoutes } from "./modules/listings/listings.route";

export const businessesRoutes = new Hono().use(
    protectedMiddleware({ type: "user" }),
);

businessesRoutes.get(
    "/",
    describeRoute({
        description: "Find All Businesses",
        responses: generateOpenApiResponseFromSchema(
            businessesRouteSchema.findAll.response,
        ),
    }),
    async (c) => {
        const userId = c.get("user").id;
        const businesses = await businessesService.findAll({ ownerId: userId });
        return c.json(businesses, HTTP_STATUS["OK"]);
    },
);

businessesRoutes.post(
    "/",
    describeRoute({
        description: "Create a Business",
        responses: generateOpenApiResponseFromSchema(
            businessesRouteSchema.create.response,
        ),
    }),
    validator("json", businessesRouteSchema.create.request.json),
    async (c) => {
        const json = c.req.valid("json");
        const userId = c.get("user").id;
        const business = await businessesService.create({
            ...json,
            ownerId: userId,
        });

        return c.json(business, HTTP_STATUS["Created"]);
    },
);

businessesRoutes.get(
    "/:businessId",
    describeRoute({
        description: "Find A Business",
        responses: generateOpenApiResponseFromSchema(
            businessesRouteSchema.find.response,
        ),
    }),
    validator("param", businessesRouteSchema.find.request.param),
    async (c) => {
        const { businessId } = c.req.valid("param");
        const userId = c.get("user").id;
        const business = await businessesService.find({
            id: businessId,
            ownerId: userId,
        });

        return c.json(business, HTTP_STATUS["OK"]);
    },
);

businessesRoutes.patch(
    "/:businessId",
    describeRoute({
        description: "Update A Business",
        responses: generateOpenApiResponseFromSchema(
            businessesRouteSchema.update.response,
        ),
    }),
    validator("param", businessesRouteSchema.update.request.param),
    validator("json", businessesRouteSchema.update.request.json),
    async (c) => {
        const { businessId } = c.req.valid("param");
        const json = c.req.valid("json");
        const userId = c.get("user").id;
        const business = await businessesService.update({
            id: businessId,
            ownerId: userId,
            ...json,
        });

        return c.json(business, HTTP_STATUS["OK"]);
    },
);

businessesRoutes.delete(
    "/:businessId",
    describeRoute({
        description: "Delete A Business",
        responses: generateOpenApiResponseFromSchema(
            businessesRouteSchema.delete.response,
        ),
    }),
    validator("param", businessesRouteSchema.delete.request.param),
    async (c) => {
        const { businessId } = c.req.valid("param");
        const userId = c.get("user").id;
        await businessesService.delete({
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

businessesRoutes.use("/:businessId/*", businessMiddleware());

businessesRoutes.route("/:businessId/listings", listingsRoutes);
