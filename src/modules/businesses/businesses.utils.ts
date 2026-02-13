import { HTTP_STATUS } from "@/utils/status-codes";
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";
import type { BusinessesServiceSchemaType } from "./businesses.schema";
import { businessesService } from "./businesses.service";

export type BusinessContext = {
    business: BusinessesServiceSchemaType["find"]["output"];
};

export const businessProtectedMiddleware = () =>
    createMiddleware<{
        Variables: BusinessContext;
    }>(async (c, next) => {
        const businessId = c.req.param("businessId");

        if (!businessId) {
            throw new HTTPException(HTTP_STATUS["Bad Request"], {
                message: "BusinessId Not Defined",
            });
        }

        const business = await businessesService.find({
            id: businessId,
        });

        c.set("business", business);

        await next();
    });
