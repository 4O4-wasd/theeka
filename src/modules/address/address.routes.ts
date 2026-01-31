import { protectedMiddleware } from "@/middlewares/protected";
import { generateOpenApiResponseFromSchema } from "@/utils/generateOpenApiResponseFromSchema";
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
        return c.json(addresses);
    },
);

addressRoutes.post(
    "/",
    describeRoute({
        description: "Create Addresses",
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
        return c.json(address);
    },
);

addressRoutes.get(
    "/:id",
    describeRoute({
        description: "Find Address",
        responses: generateOpenApiResponseFromSchema(
            addressRouteSchema.find.response,
        ),
    }),
    sValidator("param", addressRouteSchema.find.request.param),
    async (c) => {
        const { id } = c.req.valid("param");
        const address = await addressService.find({
            id,
            userId: c.get("user").id,
        });
        return c.json(address);
    },
);

addressRoutes.patch(
    "/:id",
    describeRoute({
        description: "Update Address",
        responses: generateOpenApiResponseFromSchema(
            addressRouteSchema.update.response,
        ),
    }),
    sValidator("param", addressRouteSchema.update.request.param),
    sValidator("json", addressRouteSchema.update.request.json),
    async (c) => {
        const { id } = c.req.valid("param");
        const data = c.req.valid("json");
        const address = await addressService.update({
            ...data,
            id,
            userId: c.get("user").id,
        });

        return c.json(address);
    },
);
