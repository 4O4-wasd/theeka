import { protectedMiddleware } from "@/middlewares/protected";
import { sValidator } from "@hono/standard-validator";
import { Hono } from "hono";
import { addressRouteSchema } from "./address.schema";
import { addressService } from "./address.service";

export const addressRoutes = new Hono().use(
    protectedMiddleware({ type: "user" }),
);

addressRoutes.get("/", async (c) => {
    const address = await addressService.findAll({ userId: c.get("user").id });
    return c.json(address);
});

addressRoutes.post(
    "/",
    sValidator("json", addressRouteSchema.create.json),
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
    sValidator("param", addressRouteSchema.find.param),
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
    sValidator("param", addressRouteSchema.update.param),
    sValidator("json", addressRouteSchema.update.json),
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
