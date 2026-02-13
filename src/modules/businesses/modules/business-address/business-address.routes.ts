import { route } from "@/utils/open-api";
import { HTTP_STATUS } from "@/utils/status-codes";
import { Hono } from "hono";
import { businessProtectedMiddleware } from "../../businesses.utils";
import { employeeRoleProtectedMiddleware } from "../employees/employees.utils";
import { businessAddressRouteSchema } from "./business-address.schema";
import { businessAddressService } from "./business-address.service";

export const businessAddressRoutes = new Hono()
    .use(businessProtectedMiddleware())

    .on(...route("GET /", businessAddressRouteSchema), async (c) => {
        const { id } = c.get("business");
        const address = await businessAddressService.find({ businessId: id });
        return c.json(address, HTTP_STATUS["OK"]);
    })

    .on(
        ...route("POST /", businessAddressRouteSchema),
        employeeRoleProtectedMiddleware({ role: "manager" }),
        async (c) => {
            const { id } = c.get("business");
            const json = c.req.valid("json");
            const address = await businessAddressService.create({
                businessId: id,
                ...json,
            });
            return c.json(address, HTTP_STATUS["Created"]);
        },
    )
    .on(
        ...route("PATCH /", businessAddressRouteSchema),
        employeeRoleProtectedMiddleware({ role: "manager" }),
        async (c) => {
            const { id } = c.get("business");
            const json = c.req.valid("json");
            const address = await businessAddressService.update({
                businessId: id,
                ...json,
            });
            return c.json(address, HTTP_STATUS["OK"]);
        },
    )
    .on(
        ...route("DELETE /", businessAddressRouteSchema),
        employeeRoleProtectedMiddleware({ role: "owner" }),
        async (c) => {
            const { id } = c.get("business");
            const address = await businessAddressService.delete({
                businessId: id,
            });
            return c.json(
                {
                    success: true,
                },
                HTTP_STATUS["OK"],
            );
        },
    );
