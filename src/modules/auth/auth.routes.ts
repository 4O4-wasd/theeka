import {
    invertedProtectedMiddleware,
    protectedMiddleware,
} from "@/middlewares/protected";
import { route } from "@/utils/open-api";
import { HTTP_STATUS } from "@/utils/status-codes";
import { Hono } from "hono";
import { describeRoute, validator } from "hono-openapi";
import { HTTPException } from "hono/http-exception";
import { authRouteSchema } from "./auth.schema";
import { authService } from "./auth.service";

export const authRoutes = new Hono()
    .on(
        ...route("POST /login", authRouteSchema),
        invertedProtectedMiddleware({ type: "account" }),
        async (c) => {
            const body = c.req.valid("json");
            const token = await authService.login({
                ...body,
                ipAddress: "127.0.0.1",
                userAgent: "no useragent",
            });

            return c.json(token, HTTP_STATUS["OK"]);
        },
    )

    .on(
        ...route("POST /user", authRouteSchema),
        protectedMiddleware({ type: "account" }),
        invertedProtectedMiddleware({ type: "user" }),
        async (c) => {
            const body = c.req.valid("json");
            const user = await authService.createUser({
                ...body,
                accountId: c.get("account").id,
            });

            return c.json(user, HTTP_STATUS["Created"]);
        },
    )

    .on(
        ...route("GET /user", authRouteSchema),
        protectedMiddleware({ type: "user" }),
        async (c) => {
            return c.json(c.get("user"), HTTP_STATUS["OK"]);
        },
    )

    .on(
        ...route("GET /account", authRouteSchema),
        protectedMiddleware({ type: "account" }),
        async (c) => {
            return c.json(c.get("account"), HTTP_STATUS["OK"]);
        },
    )

    .on(
        ...route("GET /sessions", authRouteSchema),
        protectedMiddleware({ type: "account" }),
        async (c) => {
            const sessions = await authService.findAllSessions({
                accountId: c.get("account").id,
            });
            return c.json(sessions, HTTP_STATUS["OK"]);
        },
    )

    .on(
        ...route("DELETE /sessions", authRouteSchema),
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
    )

    .on(
        ...route("GET /logout", authRouteSchema),
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
