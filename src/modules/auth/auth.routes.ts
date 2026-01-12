import { protectedMiddleware } from "@/middlewares/protected";
import { sValidator } from "@hono/standard-validator";
import { Hono } from "hono";
import { createUserSchema, logInInputSchema } from "./auth.schema";
import { AuthService } from "./auth.service";

export const authRoutes = new Hono();
const authService = new AuthService();

authRoutes.post("/login", sValidator("json", logInInputSchema), async (c) => {
    const body = c.req.valid("json");
    const token = await authService.logIn({
        ...body,
        ipAddress: "127.0.0.1",
        userAgent: "abc",
    });

    return c.json({ token });
});

authRoutes.post(
    "/createUser",
    sValidator("json", createUserSchema),
    async (c) => {
        const body = c.req.valid("json");
        const user = await authService.createUser(body);

        return c.json(user);
    }
);

authRoutes
    .use(protectedMiddleware({ type: "user" }))
    .get("/findUser", async (c) => {
        return c.json({ ...c.get("user"), account: c.get("account") });
    });

authRoutes
    .use(protectedMiddleware({ type: "account" }))
    .get("/findAccount", async (c) => {
        return c.json(c.get("account"));
    });
