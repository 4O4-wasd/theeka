import { accountSchema, sessionSchema, userSchema } from "@/db/schema";
import type { DefaultSchemaType, InferSchema } from "@/utils/types";
import { z } from "zod";

const schema = {
    repository() {
        return {
            createAccount: {
                input: z.object({
                    password: accountSchema.shape.password,
                    phone: accountSchema.shape.phone,
                    ipAddress: sessionSchema.shape.ipAddress,
                    userAgent: sessionSchema.shape.userAgent,
                }),

                output: sessionSchema.pick({
                    token: true,
                }),
            },

            createSession: {
                input: z.object({
                    ipAddress: sessionSchema.shape.ipAddress,
                    userAgent: sessionSchema.shape.userAgent,
                    accountId: accountSchema.shape.id,
                }),

                output: sessionSchema.pick({
                    token: true,
                }),
            },

            findAccount: {
                input: sessionSchema.pick({
                    token: true,
                }),

                output: accountSchema
                    .omit({
                        password: true,
                    })
                    .optional(),
            },

            findAccountByPhone: {
                input: accountSchema.pick({
                    phone: true,
                }),

                output: accountSchema.optional(),
            },

            findUser: {
                input: sessionSchema.pick({
                    token: true,
                }),

                output: userSchema
                    .omit({
                        accountId: true,
                    })
                    .optional(),
            },

            createUser: {
                input: userSchema.omit({
                    id: true,
                }),

                output: userSchema.omit({
                    accountId: true,
                }),
            },

            findAllSessions: {
                input: z.object({
                    accountId: accountSchema.shape.id,
                }),
                output: z.array(
                    sessionSchema.omit({
                        accountId: true,
                    }),
                ),
            },

            deleteSession: {
                input: z.object({
                    accountId: accountSchema.shape.id,
                    token: sessionSchema.shape.token,
                }),
            },

            logout: {
                input: sessionSchema.pick({
                    token: true,
                }),
            },
        } satisfies DefaultSchemaType.Repository;
    },

    service() {
        return {
            login: this.repository().createAccount,
            findAccount: this.repository().findAccount,
            findAccountByPhone: this.repository().findAccountByPhone,
            findUser: this.repository().findUser,
            createUser: this.repository().createUser,
            findAllSessions: this.repository().findAllSessions,
            deleteSession: this.repository().deleteSession,
            logout: this.repository().logout,
        } satisfies DefaultSchemaType.Service;
    },

    route() {
        return {
            "POST /login": {
                description: "Login",
                request: {
                    json: this.service().login.input.pick({
                        phone: true,
                        password: true,
                    }),
                },
                response: {
                    OK: this.service().login.output,
                },
            },

            "GET /account": {
                description: "Find Account",
                request: {},
                response: {
                    OK: this.service().findAccount.output,
                },
            },

            "GET /user": {
                description: "Find User",
                request: {},
                response: {
                    OK: this.service().findUser.output,
                },
            },

            "POST /user": {
                description: "Create User",
                request: {
                    json: this.service().createUser.input.omit({
                        accountId: true,
                    }),
                },

                response: {
                    Created: this.service().createUser.output,
                },
            },

            "GET /sessions": {
                description: "Find All Sessions",
                request: {},
                response: {
                    OK: this.service().findAllSessions.output,
                },
            },

            "DELETE /sessions": {
                description: "Delete A Session",
                request: {
                    json: this.service().deleteSession.input.pick({
                        token: true,
                    }),
                },
                response: {
                    OK: z.object({
                        success: z.boolean().default(true),
                    }),
                },
            },

            "GET /logout": {
                description: "Logout",
                request: {},
                response: {
                    OK: z.object({
                        success: z.boolean().default(true),
                    }),
                },
            },
        } satisfies DefaultSchemaType.Route;
    },
};

export const authRouteSchema = schema.route();

type AuthSchemaType = InferSchema<typeof schema>;

export type AuthRepositorySchemaType = AuthSchemaType["repository"];
export type AuthServiceSchemaType = AuthSchemaType["service"];
