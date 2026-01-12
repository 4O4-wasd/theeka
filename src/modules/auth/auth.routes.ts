import { protectedMiddleware } from "@/middlewares/protected";
import { sValidator } from "@hono/standard-validator";
import { Hono } from "hono";
import { createUserJsonSchema, logInJsonSchema } from "./auth.schema";
import { AuthService } from "./auth.service";

export const authRoutes = new Hono();
const authService = new AuthService();

authRoutes.post("/login", sValidator("json", logInJsonSchema), async (c) => {
    const body = c.req.valid("json");
    const token = await authService.logIn({
        ...body,
        ipAddress: "127.0.0.1",
        userAgent: "abc",
    });

    return c.json({ token });
});

authRoutes.post(
    "/user",
    sValidator("json", createUserJsonSchema),
    protectedMiddleware({ type: "account" }),
    async (c) => {
        const body = c.req.valid("json");
        const user = await authService.createUser({
            ...body,
            accountId: c.get("account").id,
        });

        return c.json(user);
    }
);

authRoutes.get("/user", protectedMiddleware({ type: "user" }), async (c) => {
    return c.json({ ...c.get("user"), account: c.get("account") });
});

authRoutes.get(
    "/account",
    protectedMiddleware({ type: "account" }),
    async (c) => {
        return c.json(c.get("account"));
    }
);
