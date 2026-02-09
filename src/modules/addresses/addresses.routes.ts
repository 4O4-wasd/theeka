import { protectedMiddleware } from "@/middlewares/protected";
import { route } from "@/utils/open-api";
import { HTTP_STATUS } from "@/utils/status-codes";
import { Hono } from "hono";
import { addressesRouteSchema } from "./addresses.schema";
import { addressesService } from "./addresses.service";

export const addressesRoutes = new Hono()
    .use(protectedMiddleware({ type: "user" }))

    .on(...route("GET /", addressesRouteSchema), async (c) => {
        const addresses = await addressesService.findAll({
            userId: c.get("user").id,
        });
        return c.json(addresses, HTTP_STATUS["OK"]);
    })

    .on(...route("POST /", addressesRouteSchema), async (c) => {
        const data = c.req.valid("json");
        const address = await addressesService.create({
            ...data,
            userId: c.get("user").id,
        });
        return c.json(address, HTTP_STATUS["Created"]);
    })

    .on(...route("GET /:addressId", addressesRouteSchema), async (c) => {
        const { addressId } = c.req.valid("param");
        const address = await addressesService.find({
            id: addressId,
            userId: c.get("user").id,
        });
        return c.json(address, HTTP_STATUS["OK"]);
    })

    .on(...route("PATCH /:addressId", addressesRouteSchema), async (c) => {
        const { addressId } = c.req.valid("param");
        const data = c.req.valid("json");
        const address = await addressesService.update({
            ...data,
            id: addressId,
            userId: c.get("user").id,
        });

        return c.json(address, HTTP_STATUS["OK"]);
    })

    .on(...route("DELETE /:addressId", addressesRouteSchema), async (c) => {
        const { addressId } = c.req.valid("param");
        await addressesService.delete({
            id: addressId,
            userId: c.get("user").id,
        });

        return c.json("hello", HTTP_STATUS["OK"]);
    });
