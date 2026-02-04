import { type ProtectedUserContext } from "@/middlewares/protected";
import { HTTP_STATUS } from "@/utils/status-codes";
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import z from "zod";
import type { BusinessServiceSchemaType } from "./business.schema";
import { businessService } from "./business.service";

export type BusinessContext = ProtectedUserContext & {
    business: BusinessServiceSchemaType["find"]["output"];
}

export const businessMiddleware = () =>
    createMiddleware<{
        Variables: BusinessContext;
    }>(async (c, next) => {
        const rawBusinessId = c.req.param("businessId");

        if (!rawBusinessId) {
            throw new HTTPException(HTTP_STATUS["Not Found"], {
                message: "Business was not found",
            });
        }

        const { data: businessId } = z.uuid().safeParse(rawBusinessId);

        if (!businessId) {
            throw new HTTPException(HTTP_STATUS["Bad Request"], {
                message: "Id was not formatted correctly",
            });
        }

        const userId = c.get("user").id;

        const business = await businessService.find({
            id: businessId,
            ownerId: userId,
        });

        c.set("business", business);

        await next();
    });
