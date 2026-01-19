import { accountSchema, sessionSchema, userSchema } from "@/db/schema";
import { HTTP_STATUS } from "@/status-codes";
import type { InferSchema } from "@/utils";
import { z } from "zod";

export const authSchema = {
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
        };
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
        };
    },

    route() {
        return {
            login: {
                json: this.service().login.input.pick({
                    phone: true,
                    password: true,
                }),

                [HTTP_STATUS["OK"]]: this.service().login.output,
            },

            findAccount: {
                [HTTP_STATUS["OK"]]: this.service().findAccount.output,
            },

            findUser: {
                [HTTP_STATUS["OK"]]: this.service().findUser.output,
            },

            createUser: {
                json: this.service().createUser.input.omit({ accountId: true }),

                [HTTP_STATUS["Created"]]: this.service().createUser.output,
            },

            findAllSessions: {
                [HTTP_STATUS["OK"]]: this.service().findAllSessions.output,
            },

            deleteSession: {
                json: this.service().deleteSession.input.pick({
                    token: true,
                }),
            },
        };
    },
};

export const authRouteSchema = authSchema.route();

export type AuthSchemaType = InferSchema<typeof authSchema>;
export type AuthRepositorySchemaType = InferSchema<
    typeof authSchema
>["repository"];
export type AuthServiceSchemaType = InferSchema<typeof authSchema>["service"];
