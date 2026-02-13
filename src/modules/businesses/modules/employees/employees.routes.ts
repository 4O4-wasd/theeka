import { route } from "@/utils/open-api";
import { HTTP_STATUS } from "@/utils/status-codes";
import { Hono } from "hono";
import { businessProtectedMiddleware } from "../../businesses.utils";
import { employeesRouteSchema } from "./employees.schema";
import { employeesService } from "./employees.service";
import { employeeRoleProtectedMiddleware } from "./employees.utils";

export const employeesRoutes = new Hono()
    .use(businessProtectedMiddleware())
    .on(...route("GET /", employeesRouteSchema), async (c) => {
        const employees = await employeesService.findAll({
            businessId: c.get("business").id,
        });
        return c.json(employees, HTTP_STATUS["OK"]);
    })

    .on(
        ...route("POST /", employeesRouteSchema),
        employeeRoleProtectedMiddleware({ role: "manager" }),
        async (c) => {
            const data = c.req.valid("json");
            const employee = await employeesService.create({
                ...data,
                businessId: c.get("business").id,
            });
            return c.json(employee, HTTP_STATUS["Created"]);
        },
    )

    .on(...route("GET /:employeeUserId", employeesRouteSchema), async (c) => {
        const { employeeUserId } = c.req.valid("param");
        const employee = await employeesService.find({
            userId: employeeUserId,
            businessId: c.get("business").id,
        });
        return c.json(employee, HTTP_STATUS["OK"]);
    })

    .on(
        ...route("PATCH /:employeeUserId", employeesRouteSchema),
        employeeRoleProtectedMiddleware({ role: "manager" }),
        async (c) => {
            const { employeeUserId } = c.req.valid("param");
            const json = c.req.valid("json");
            const employee = await employeesService.update({
                ...json,
                userId: employeeUserId,
                businessId: c.get("business").id,
            });

            return c.json(employee, HTTP_STATUS["OK"]);
        },
    )

    .on(
        ...route("DELETE /:employeeUserId", employeesRouteSchema),
        employeeRoleProtectedMiddleware({ role: "manager" }),
        async (c) => {
            const { employeeUserId } = c.req.valid("param");
            await employeesService.delete({
                userId: employeeUserId,
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
