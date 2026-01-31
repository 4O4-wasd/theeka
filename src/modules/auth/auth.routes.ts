import {
    invertedProtectedMiddleware,
    protectedMiddleware,
} from "@/middlewares/protected";
import { HTTP_STATUS } from "@/status-codes";
import { generateOpenApiResponseFromSchema } from "@/utils/generateOpenApiResponseFromSchema";
import { Hono } from "hono";
import { describeRoute, validator } from "hono-openapi";
import { HTTPException } from "hono/http-exception";
import { authRouteSchema } from "./auth.schema";
import { authService } from "./auth.service";

export const authRoutes = new Hono();

authRoutes.post(
    "/login",
    describeRoute({
        description: "Login",
        responses: generateOpenApiResponseFromSchema(
            authRouteSchema.login.response,
        ),
    }),
    validator("json", authRouteSchema.login.request.json),
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
);

authRoutes.post(
    "/user",
    describeRoute({
        description: "Create User",
        responses: generateOpenApiResponseFromSchema(
            authRouteSchema.createUser.response,
        ),
    }),
    validator("json", authRouteSchema.createUser.request.json),
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

authRoutes.get(
    "/user",
    describeRoute({
        description: "Find User",
        responses: generateOpenApiResponseFromSchema(
            authRouteSchema.findUser.response,
        ),
    }),
    protectedMiddleware({ type: "user" }),
    async (c) => {
        return c.json(c.get("user"), HTTP_STATUS["OK"]);
    },
);

authRoutes.get(
    "/account",
    describeRoute({
        description: "Find Account",
        responses: generateOpenApiResponseFromSchema(
            authRouteSchema.findAccount.response,
        ),
    }),
    protectedMiddleware({ type: "account" }),
    async (c) => {
        return c.json(c.get("account"), HTTP_STATUS["OK"]);
    },
);

authRoutes.get(
    "/sessions",
    describeRoute({
        description: "Find All Sessions",
        responses: generateOpenApiResponseFromSchema(
            authRouteSchema.findAllSessions.response,
        ),
    }),
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
    describeRoute({
        description: "Delete Session",
        responses: generateOpenApiResponseFromSchema(
            authRouteSchema.deleteSession.response,
        ),
    }),
    validator("json", authRouteSchema.deleteSession.request.json),
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
    describeRoute({
        description: "Logout",
        responses: generateOpenApiResponseFromSchema(
            authRouteSchema.logout.response,
        ),
    }),
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
