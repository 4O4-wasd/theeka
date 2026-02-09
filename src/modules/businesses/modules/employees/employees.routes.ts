import { route } from "@/utils/open-api";
import { Hono } from "hono";
import { businessProtectedMiddleware } from "../../businesses.utils";
import { employeesRouteSchema } from "./employees.schema";
import { employeesService } from "./employees.service";
import { HTTP_STATUS } from "@/utils/status-codes";

export const employeesRoutes = new Hono()
    .use(businessProtectedMiddleware())
    .on(...route("GET /", employeesRouteSchema), async (c) => {
        const addresses = await employeesService.findAll({
            businessId: c.get("business").id,
        });
        return c.json(addresses, HTTP_STATUS["OK"]);
    })

    .on(...route("POST /", employeesRouteSchema), async (c) => {
        const data = c.req.valid("json");
        const address = await employeesService.create({
            ...data,
            businessId: c.get("business").id,
        });
        return c.json(address, HTTP_STATUS["Created"]);
    })

    .on(...route("GET /:employeeUserId", employeesRouteSchema), async (c) => {
        const { employeeUserId } = c.req.valid("param");
        const address = await employeesService.find({
            userId: employeeUserId,
            businessId: c.get("business").id,
        });
        return c.json(address, HTTP_STATUS["OK"]);
    })

    .on(...route("PATCH /:employeeUserId", employeesRouteSchema), async (c) => {
        const { employeeUserId } = c.req.valid("param");
        const json = c.req.valid("json");
        const address = await employeesService.update({
            ...json,
            userId: employeeUserId,
            businessId: c.get("business").id,
        });

        return c.json(address, HTTP_STATUS["OK"]);
    })

    .on(
        ...route("DELETE /:employeeUserId", employeesRouteSchema),
        async (c) => {
            const { employeeUserId } = c.req.valid("param");
            await employeesService.delete({
                userId: employeeUserId,
                businessId: c.get("business").id,
            });

            return c.json("hello", HTTP_STATUS["OK"]);
        },
    );

