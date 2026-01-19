import {
    invertedProtectedMiddleware,
    protectedMiddleware,
} from "@/middlewares/protected";
import { HTTP_STATUS } from "@/status-codes";
import { sValidator } from "@hono/standard-validator";
import { Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import { authRouteSchema } from "./auth.schema";
import { authService } from "./auth.service";

export const authRoutes = new Hono();

authRoutes.post(
    "/login",
    sValidator("json", authRouteSchema.login.json),
    invertedProtectedMiddleware({ type: "account" }),
    async (c) => {
        const body = c.req.valid("json");
        const token = await authService.login({
            ...body,
            ipAddress: "127.0.0.1",
            userAgent: "abc",
        });

        return c.json(token, HTTP_STATUS["OK"]);
    },
);

authRoutes.post(
    "/user",
    sValidator("json", authRouteSchema.createUser.json),
    invertedProtectedMiddleware({ type: "user" }),
    protectedMiddleware({ type: "account" }),
    async (c) => {
        const body = c.req.valid("json");
        const user = await authService.createUser({
            ...body,
            accountId: c.get("account").id,
        });

        return c.json(user, HTTP_STATUS["Created"]);
    },
);

authRoutes.get("/user", protectedMiddleware({ type: "user" }), async (c) => {
    return c.json(c.get("user"), HTTP_STATUS["OK"]);
});

authRoutes.get(
    "/account",
    protectedMiddleware({ type: "account" }),
    async (c) => {
        return c.json(c.get("account"), HTTP_STATUS["OK"]);
    },
);

authRoutes.get(
    "/sessions",
    protectedMiddleware({ type: "account" }),
    async (c) => {
        const sessions = await authService.findAllSessions({
            accountId: c.get("account").id,
        });
        return c.json(sessions, HTTP_STATUS["OK"]);
    },
);

authRoutes.delete(
    "/session",
    sValidator("json", authRouteSchema.deleteSession.json),
    protectedMiddleware({ type: "account" }),
    async (c) => {
        const token = c.req.valid("json").token;

        if (token === c.get("sessionToken")) {
            throw new HTTPException(HTTP_STATUS["Forbidden"], {
                message: "You cannot delete your current session",
            });
        }

        await authService.deleteSession({
            token,
            accountId: c.get("account").id,
        });
        return c.json(
            {
                success: true,
            },
            HTTP_STATUS["OK"],
        );
    },
);

authRoutes.get(
    "/logout",
    protectedMiddleware({ type: "account" }),
    async (c) => {
        await authService.logout({
            token: c.get("sessionToken"),
        });

        return c.json(
            {
                success: true,
            },
            HTTP_STATUS["OK"],
        );
    },
);
