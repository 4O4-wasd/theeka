import { protectedMiddleware } from "@/middlewares/protected";
import { generateOpenApiResponseFromSchema } from "@/utils/open-api";
import { HTTP_STATUS } from "@/utils/status-codes";
import { sValidator } from "@hono/standard-validator";
import { Hono } from "hono";
import { describeRoute } from "hono-openapi";
import { addressRouteSchema } from "./address.schema";
import { addressService } from "./address.service";

export const addressRoutes = new Hono().use(
    protectedMiddleware({ type: "user" }),
);

addressRoutes.get(
    "/",
    describeRoute({
        description: "Find All Addresses",
        responses: generateOpenApiResponseFromSchema(
            addressRouteSchema.findAll.response,
        ),
    }),
    async (c) => {
        const addresses = await addressService.findAll({
            userId: c.get("user").id,
        });
        return c.json(addresses, HTTP_STATUS["OK"]);
    },
);

addressRoutes.post(
    "/",
    describeRoute({
        description: "Create An Addresses",
        responses: generateOpenApiResponseFromSchema(
            addressRouteSchema.create.response,
        ),
    }),
    sValidator("json", addressRouteSchema.create.request.json),
    async (c) => {
        const data = c.req.valid("json");
        const address = await addressService.create({
            ...data,
            userId: c.get("user").id,
        });
        return c.json(address, HTTP_STATUS["Created"]);
    },
);

addressRoutes.get(
    "/:addressId",
    describeRoute({
        description: "Find An Address",
        responses: generateOpenApiResponseFromSchema(
            addressRouteSchema.find.response,
        ),
    }),
    sValidator("param", addressRouteSchema.find.request.param),
    async (c) => {
        const { addressId } = c.req.valid("param");
        const address = await addressService.find({
            id: addressId,
            userId: c.get("user").id,
        });
        return c.json(address, HTTP_STATUS["OK"]);
    },
);

addressRoutes.patch(
    "/:addressId",
    describeRoute({
        description: "Update An Address",
        responses: generateOpenApiResponseFromSchema(
            addressRouteSchema.update.response,
        ),
    }),
    sValidator("param", addressRouteSchema.update.request.param),
    sValidator("json", addressRouteSchema.update.request.json),
    async (c) => {
        const { addressId } = c.req.valid("param");
        const data = c.req.valid("json");
        const address = await addressService.update({
            ...data,
            id: addressId,
            userId: c.get("user").id,
        });

        return c.json(address, HTTP_STATUS["OK"]);
    },
);

addressRoutes.delete(
    "/:addressId",
    describeRoute({
        description: "Delete An Address",
        responses: generateOpenApiResponseFromSchema(
            addressRouteSchema.delete.response,
        ),
    }),
    sValidator("param", addressRouteSchema.delete.request.param),
    async (c) => {
        const { addressId } = c.req.valid("param");
        await addressService.delete({
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
