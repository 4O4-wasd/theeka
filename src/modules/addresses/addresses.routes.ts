import { protectedMiddleware } from "@/middlewares/protected";
import { generateOpenApiResponseFromSchema } from "@/utils/open-api";
import { HTTP_STATUS } from "@/utils/status-codes";
import { sValidator } from "@hono/standard-validator";
import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
import { addressesRouteSchema } from "./addresses.schema";
import { addressesService } from "./addresses.service";

export const addressesRoutes = new Hono().use(
    protectedMiddleware({ type: "user" }),
);

addressesRoutes.get(
    "/",
    describeRoute({
        description: "Find All Addresses",
        responses: generateOpenApiResponseFromSchema(
            addressesRouteSchema.findAll.response,
        ),
    }),
    async (c) => {
        const addresses = await addressesService.findAll({
            userId: c.get("user").id,
        });
        return c.json(addresses, HTTP_STATUS["OK"]);
    },
);

addressesRoutes.post(
    "/",
    describeRoute({
        description: "Create An Addresses",
        responses: generateOpenApiResponseFromSchema(
            addressesRouteSchema.create.response,
        ),
    }),
    sValidator("json", addressesRouteSchema.create.request.json),
    async (c) => {
        const data = c.req.valid("json");
        const address = await addressesService.create({
            ...data,
            userId: c.get("user").id,
        });
        return c.json(address, HTTP_STATUS["Created"]);
    },
);

addressesRoutes.get(
    "/:addressId",
    describeRoute({
        description: "Find An Address",
        responses: generateOpenApiResponseFromSchema(
            addressesRouteSchema.find.response,
        ),
    }),
    sValidator("param", addressesRouteSchema.find.request.param),
    async (c) => {
        const { addressId } = c.req.valid("param");
        const address = await addressesService.find({
            id: addressId,
            userId: c.get("user").id,
        });
        return c.json(address, HTTP_STATUS["OK"]);
    },
);

addressesRoutes.patch(
    "/:addressId",
    describeRoute({
        description: "Update An Address",
        responses: generateOpenApiResponseFromSchema(
            addressesRouteSchema.update.response,
        ),
    }),
    sValidator("param", addressesRouteSchema.update.request.param),
    sValidator("json", addressesRouteSchema.update.request.json),
    async (c) => {
        const { addressId } = c.req.valid("param");
        const data = c.req.valid("json");
        const address = await addressesService.update({
            ...data,
            id: addressId,
            userId: c.get("user").id,
        });

        return c.json(address, HTTP_STATUS["OK"]);
    },
);

addressesRoutes.delete(
    "/:addressId",
    describeRoute({
        description: "Delete An Address",
        responses: generateOpenApiResponseFromSchema(
            addressesRouteSchema.delete.response,
        ),
    }),
    sValidator("param", addressesRouteSchema.delete.request.param),
    async (c) => {
        const { addressId } = c.req.valid("param");
        await addressesService.delete({
            id: addressId,
            userId: c.get("user").id,
        });

        return c.json(
            {
                success: true,
            },
            HTTP_STATUS["OK"],
        );
    },
);
