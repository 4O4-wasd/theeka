import type { AccountSchemaType, UserSchemaType } from "@/db/schema";
import { AuthService } from "@/modules/auth/auth.service";
import { createMiddleware } from "hono/factory";
import { HTTPException } from "hono/http-exception";

export type ProtectedContext = {
    sessionToken: string;
};

export type ProtectedAccountContext = ProtectedContext & {
    account: AccountSchemaType;
};

export type ProtectedUserContext = ProtectedAccountContext & {
    user: UserSchemaType;
};

const authService = new AuthService();

export const protectedMiddleware = <T extends "user" | "account">({
    type,
}: {
    type: T;
}) =>
    createMiddleware<{
        Variables: T extends "user"
            ? ProtectedUserContext
            : T extends "account"
            ? ProtectedAccountContext
            : undefined;
    }>(async (c, next) => {
        const token = c.req.header("Authorization");
        if (token && (type === "account" || type === "user")) {
            if (type === "account") {
                const account = await authService.findAccount(token);
                if (!account) {
                    throw new HTTPException(401, {
                        message:
                            "Your session might be revoked or you are just testing us",
                    });
                }

                c.set("account", account);
            }

            if (type === "user") {
                const userAndAccount = await authService.findUser(token);
                if (!userAndAccount) {
                    throw new HTTPException(401, {
                        message:
                            "Your session might be revoked or you are just testing us",
                    });
                }

                c.set("user", userAndAccount.user);
                c.set("account", userAndAccount.account);
            }
            c.set("sessionToken", token);

            await next();
        } else {
            throw new HTTPException(401, {
                message: "Please sign-in/sign-up to use this api route",
            });
        }
    });
