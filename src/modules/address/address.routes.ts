import { protectedMiddleware } from "@/middlewares/protected";
import { sValidator } from "@hono/standard-validator";
import { Hono } from "hono";
import {
    createAddressInputSchema,
    findAddressParamSchema,
    updateAddressInputSchema,
    updateAddressParamSchema,
} from "./address.schema";
import { AddressService } from "./address.service";

export const addressRoutes = new Hono().use(
    protectedMiddleware({ type: "user" })
);
const addressService = new AddressService();

addressRoutes.get("/", async (c) => {
    const address = await addressService.findAll(c.get("user").id);
    return c.json(address);
});

addressRoutes.post(
    "/",
    sValidator("json", createAddressInputSchema),
    async (c) => {
        const data = c.req.valid("json");
        const address = await addressService.create({
            ...data,
            userId: c.get("user").id,
        });
        return c.json(address);
    }
);

addressRoutes.get(
    "/:id",
    sValidator("param", findAddressParamSchema),
    async (c) => {
        const { id } = c.req.valid("param");
        const address = await addressService.find({
            id,
            userId: c.get("user").id,
        });
        return c.json(address);
    }
);

addressRoutes.patch(
    "/:id",
    sValidator("param", updateAddressParamSchema),
    sValidator("json", updateAddressInputSchema),
    async (c) => {
        const { id } = c.req.valid("param");
        const data = c.req.valid("json");
        const address = await addressService.update({
            ...data,
            id,
            userId: c.get("user").id,
        });
        return c.json(address);
    }
);
