import { protectedMiddleware } from "@/middlewares/protected";
import { route } from "@/utils/open-api";
import { HTTP_STATUS } from "@/utils/status-codes";
import { Hono } from "hono";
import { businessesRouteSchema } from "./businesses.schema";
import { businessesService } from "./businesses.service";
import { businessMiddleware } from "./businesses.utils";
import { businessAddressRoutes } from "./modules/business-address/business-address.route";
import { listingsRoutes } from "./modules/listings/listings.route";

export const businessesRoutes = new Hono()
    .use(protectedMiddleware({ type: "user" }))

    .on(...route("GET /", businessesRouteSchema), async (c) => {
        const userId = c.get("user").id;
        const businesses = await businessesService.findAll({ ownerId: userId });
        return c.json(businesses, HTTP_STATUS["OK"]);
    })

    .on(...route("POST /", businessesRouteSchema), async (c) => {
        const json = c.req.valid("json");
        const userId = c.get("user").id;
        const business = await businessesService.create({
            ...json,
            ownerId: userId,
        });

        return c.json(business, HTTP_STATUS["Created"]);
    })

    .on(...route("GET /:businessId", businessesRouteSchema), async (c) => {
        const { businessId } = c.req.valid("param");
        const userId = c.get("user").id;
        const business = await businessesService.find({
            id: businessId,
            ownerId: userId,
        });

        return c.json(business, HTTP_STATUS["OK"]);
    })

    .on(...route("PATCH /:businessId", businessesRouteSchema), async (c) => {
        const { businessId } = c.req.valid("param");
        const json = c.req.valid("json");
        const userId = c.get("user").id;
        const business = await businessesService.update({
            id: businessId,
            ownerId: userId,
            ...json,
        });

        return c.json(business, HTTP_STATUS["OK"]);
    })

    .on(...route("DELETE /:businessId", businessesRouteSchema), async (c) => {
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
    })

    .use("/:businessId/*", businessMiddleware())
    .route("/:businessId/address", businessAddressRoutes)
    .route("/:businessId/listings", listingsRoutes);
