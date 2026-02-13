import { route } from "@/utils/open-api";
import { HTTP_STATUS } from "@/utils/status-codes";
import { Hono } from "hono";
import { businessProtectedMiddleware } from "../../businesses.utils";
import { employeeRoleProtectedMiddleware } from "../employees/employees.utils";
import { listingsRouteSchema } from "./listings.schema";
import { listingsService } from "./listings.service";

export const listingsRoutes = new Hono()
    .use(businessProtectedMiddleware())

    .on(...route("GET /", listingsRouteSchema), async (c) => {
        const listings = await listingsService.findAll({
            businessId: c.get("business").id,
        });
        return c.json(listings, HTTP_STATUS["OK"]);
    })

    .on(
        ...route("POST /", listingsRouteSchema),
        employeeRoleProtectedMiddleware({ role: "manager" }),
        async (c) => {
            const data = c.req.valid("json");
            const listing = await listingsService.create({
                ...data,
                businessId: c.get("business").id,
            });
            return c.json(listing, HTTP_STATUS["Created"]);
        },
    )

    .on(...route("GET /:listingId", listingsRouteSchema), async (c) => {
        const { listingId } = c.req.valid("param");
        const listing = await listingsService.find({
            id: listingId,
            businessId: c.get("business").id,
        });
        return c.json(listing, HTTP_STATUS["OK"]);
    })

    .on(
        ...route("PATCH /:listingId", listingsRouteSchema),
        employeeRoleProtectedMiddleware({ role: "manager" }),
        async (c) => {
            const { listingId } = c.req.valid("param");
            const data = c.req.valid("json");
            const listing = await listingsService.update({
                ...data,
                id: listingId,
                businessId: c.get("business").id,
            });

            return c.json(listing, HTTP_STATUS["OK"]);
        },
    )

    .on(
        ...route("DELETE /:listingId", listingsRouteSchema),
        employeeRoleProtectedMiddleware({ role: "manager" }),
        async (c) => {
            const { listingId } = c.req.valid("param");
            await listingsService.delete({
                id: listingId,
                businessId: c.get("business").id,
            });

            return c.json(
                {
                    success: true,
                },
                HTTP_STATUS["OK"],
            );
        },
    );
