import db from "@/db";
import { accountsTable, sessionsTable, usersTable } from "@/db/tables";
import { selectTableColumns } from "@/utils/select-table-columns";
import { HTTP_STATUS } from "@/utils/status-codes";
import type { ToFunctions } from "@/utils/types";
import argon2 from "argon2";
import { and, eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";
import type { AuthServiceSchemaType } from "./auth.schema";
import { generateBase64Token } from "./auth.utils";

export const authService = {
    async findAccountByPhone(input) {
        const account = await db.query.accountsTable.findFirst({
            where: (t, { eq }) => eq(t.phone, input.phone),
        });

        return account;
    },

    async findAccount(input) {
        const session = await db.query.sessionsTable.findFirst({
            where: (t, { eq }) => eq(t.token, input.token),
            columns: {},
            with: {
                account: {
                    columns: { password: false },
                },
            },
        });

        return session?.account;
    },

    async findUser(input) {
        const session = await db.query.sessionsTable.findFirst({
            where: (t, { eq }) => eq(t.token, input.token),
            columns: {},
            with: {
                account: {
                    columns: {},
                    with: {
                        user: {
                            columns: {
                                accountId: false,
                            },
                        },
                    },
                },
            },
        });

        return session?.account.user ?? undefined;
    },

    async createAccount(input) {
        const accountId = crypto.randomUUID();
        const sessionToken = generateBase64Token();

        await db.batch([
            db.insert(accountsTable).values({
                id: accountId,
                phone: input.phone,
                password: input.password,
            }),
            db.insert(sessionsTable).values({
                accountId,
                ipAddress: "127.0.0.1",
                token: sessionToken,
                userAgent: "no agent",
            }),
        ]);

        return {
            token: sessionToken,
        };
    },

    async createSession(input) {
        const sessionToken = generateBase64Token();

        await db.insert(sessionsTable).values({
            accountId: input.accountId,
            ipAddress: input.ipAddress,
            token: sessionToken,
            userAgent: input.userAgent,
        });

        return {
            token: sessionToken,
        };
    },

    async createUser(input) {
        const [user] = await db
            .insert(usersTable)
            .values(input)
            .returning(
                selectTableColumns(usersTable, "omit", {
                    accountId: true,
                }),
            );

        return user;
    },

    async findAllSessions(input) {
        const sessions = await db.query.sessionsTable.findMany({
            where: (t, { eq }) => eq(t.accountId, input.accountId),
            columns: {
                accountId: false,
            },
        });

        return sessions;
    },

    async deleteSession(input) {
        await db
            .delete(sessionsTable)
            .where(
                and(
                    eq(sessionsTable.accountId, input.accountId),
                    eq(sessionsTable.token, input.token),
                ),
            );
    },

    async login(input) {
        const account = await this.findAccountByPhone({
            phone: input.phone,
        });

        if (account) {
            const isPasswordMatching = await argon2.verify(
                account.password,
                input.password,
            );

            if (!isPasswordMatching) {
                throw new HTTPException(HTTP_STATUS["Unauthorized"], {
                    message: "Your password was incorrect",
                });
            }

            const token = await this.createSession({
                accountId: account.id,
                ipAddress: input.ipAddress,
                userAgent: input.userAgent,
            });

            return token;
        }

        const hashedPassword = await argon2.hash(input.password);
        const token = await this.createAccount({
            ...input,
            password: hashedPassword,
        });

        return token;
    },

    async logout(input) {
        await db
            .delete(sessionsTable)
            .where(eq(sessionsTable.token, input.token));
    },
} satisfies ToFunctions<AuthServiceSchemaType>;
