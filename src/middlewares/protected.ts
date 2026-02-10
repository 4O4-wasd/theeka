import type { AuthServiceSchemaType } from "@/modules/auth/auth.schema";
import { authService } from "@/modules/auth/auth.service";
import { HTTP_STATUS } from "@/utils/status-codes";
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";

export type ProtectedContext = {
    sessionToken: string;
};

export type ProtectedAccountContext = ProtectedContext & {
    account: NonNullable<AuthServiceSchemaType["findAccount"]["output"]>;
};

export type ProtectedUserContext = ProtectedContext & {
    user: NonNullable<AuthServiceSchemaType["findUser"]["output"]>;
};

type MiddlewareContextType = {
    user: ProtectedUserContext;
    account: ProtectedAccountContext;
};

export const protectedMiddleware = <T extends keyof MiddlewareContextType>({
    type,
}: {
    type: T;
}) =>
    createMiddleware<{
        Variables: MiddlewareContextType[T];
    }>(async (c, next) => {
        const token = c.req.header("Authorization");

        if (!token) {
            throw new HTTPException(HTTP_STATUS["Unauthorized"], {
                message: "Please sign-in/sign-up to use this api route",
            });
        }

        if (type === "account") {
            const account = await authService.findAccount({ token });

            if (!account) {
                throw new HTTPException(HTTP_STATUS["Unauthorized"], {
                    message: "Your account does not exit",
                });
            }

            c.set("account" as any, account);
        }

        if (type === "user") {
            const user = await authService.findUser({ token });

            if (!user) {
                throw new HTTPException(HTTP_STATUS["Unauthorized"], {
                    message: "Your user does not exit",
                });
            }

            c.set("user" as any, user);
        }

        c.set("sessionToken", token);

        await next();
    });
