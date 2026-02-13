import type { employeesSchema } from "@/db/tables";
import { type ProtectedUserContext } from "@/middlewares/protected";
import { HTTP_STATUS } from "@/utils/status-codes";
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import z from "zod";
import type { EmployeesServiceSchemaType } from "./employees.schema";
import { employeesService } from "./employees.service";

type EmployeeContext = ProtectedUserContext & {
    employee: EmployeesServiceSchemaType["find"]["output"];
};

export const employeeRoleProtectedMiddleware = ({
    role,
}: {
    role: z.infer<typeof employeesSchema>["role"];
}) =>
    createMiddleware<{
        Variables: EmployeeContext;
    }>(async (c, next) => {
        const businessId = c.req.param("businessId");

        if (!businessId) {
            throw new HTTPException(HTTP_STATUS["Bad Request"], {
                message: "BusinessId Not Defined",
            });
        }

        const employee = await employeesService.find({
            businessId,
            userId: c.get("user").id,
        });

        c.set("employee", employee);

        if (role === "staff") {
            await next();
            return;
        }

        if (
            role === "manager" &&
            (employee.role === "manager" || employee.role === "owner")
        ) {
            await next();
            return;
        }

        if (role === "owner" && employee.role === "owner") {
            await next();
            return;
        }

        throw new HTTPException(HTTP_STATUS["Forbidden"], {
            message: "You don't have the permission to perform this action",
        });
    });
