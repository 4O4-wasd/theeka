import db from "@/db";
import { accounts, sessions, users } from "@/db/schema";
import { selectTableColumns } from "@/utils/select-table-columns";
import type { ToFunctions } from "@/utils/types";
import { and, eq } from "drizzle-orm";
import type { AuthRepositorySchemaType } from "./auth.schema";
import { generateBase64Token } from "./auth.utils";

export const authRepository = {
    async findAccountByPhone(input) {
        const account = await db.query.accounts.findFirst({
            where: (t, { eq }) => eq(t.phone, input.phone),
        });

        return account;
    },

    async findAccount(input) {
        const session = await db.query.sessions.findFirst({
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
        const session = await db.query.sessions.findFirst({
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
            db.insert(accounts).values({
                id: accountId,
                phone: input.phone,
                password: input.password,
            }),
            db.insert(sessions).values({
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

        await db.insert(sessions).values({
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
            .insert(users)
            .values(input)
            .returning(
                selectTableColumns(users, "omit", {
                    accountId: true,
                }),
            );

        return user;
    },

    async findAllSessions(input) {
        const sessions = await db.query.sessions.findMany({
            where: (t, { eq }) => eq(t.accountId, input.accountId),
            columns: {
                accountId: false,
            },
        });

        return sessions;
    },

    async deleteSession(input) {
        await db
            .delete(sessions)
            .where(
                and(
                    eq(sessions.accountId, input.accountId),
                    eq(sessions.token, input.token),
                ),
            );
    },

    async logout(input) {
        await db.delete(sessions).where(eq(sessions.token, input.token));
    },
} satisfies ToFunctions<AuthRepositorySchemaType>;
