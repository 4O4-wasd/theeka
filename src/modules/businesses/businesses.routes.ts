import { route } from "@/utils/open-api";
import { HTTP_STATUS } from "@/utils/status-codes";
import { Hono } from "hono";
import { businessesRouteSchema } from "./businesses.schema";
import { businessesService } from "./businesses.service";
import { businessAddressRoutes } from "./modules/business-address/business-address.routes";
import { employeesRoutes } from "./modules/employees/employees.routes";
import { employeeRoleProtectedMiddleware } from "./modules/employees/employees.utils";
import { listingsRoutes } from "./modules/listings/listings.routes";
import { protectedMiddleware } from "@/middlewares/protected";

export const businessesRoutes = new Hono()
    .on(...route("GET /", businessesRouteSchema), protectedMiddleware({ type: "user" }), async (c) => {
        const userId = c.get("user").id;
        const businesses = await businessesService.findAll({ userId });
        return c.json(businesses, HTTP_STATUS["OK"]);
    })

    .on(...route("POST /", businessesRouteSchema), protectedMiddleware({ type: "user" }), async (c) => {
        const json = c.req.valid("json");
        const userId = c.get("user").id;
        const business = await businessesService.create({
            ...json,
            userId,
        });

        return c.json(business, HTTP_STATUS["Created"]);
    })

    .on(...route("GET /:businessId", businessesRouteSchema), async (c) => {
        const { businessId } = c.req.valid("param");
        const business = await businessesService.find({
            id: businessId,
        });

        return c.json(business, HTTP_STATUS["OK"]);
    })

    .on(
        ...route("PATCH /:businessId", businessesRouteSchema),
        employeeRoleProtectedMiddleware({ role: "manager" }),
        async (c) => {
            const { businessId } = c.req.valid("param");
            const json = c.req.valid("json");
            const userId = c.get("user").id;
            const business = await businessesService.update({
                id: businessId,
                userId,
                ...json,
            });

            return c.json(business, HTTP_STATUS["OK"]);
        },
    )

    .on(
        ...route("DELETE /:businessId", businessesRouteSchema),
        employeeRoleProtectedMiddleware({ role: "owner" }),
        async (c) => {
            const { businessId } = c.req.valid("param");
            const userId = c.get("user").id;
            await businessesService.delete({
                id: businessId,
                userId,
            });

            return c.json(
                {
                    success: true,
                },
                HTTP_STATUS["OK"],
            );
        },
    )

    .route("/:businessId/address", businessAddressRoutes)
    .route("/:businessId/listings", listingsRoutes)
    .route("/:businessId/employees", employeesRoutes);
