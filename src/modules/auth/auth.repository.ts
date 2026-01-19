import db from "@/db";
import { accounts, sessions, users } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import type { AuthRepositorySchemaType } from "./auth.schema";
import { generateBase64Token } from "./auth.utils";

export const authRepository = {
    async findAccountByPhone(
        input: AuthRepositorySchemaType["findAccountByPhone"]["input"],
    ): Promise<AuthRepositorySchemaType["findAccountByPhone"]["output"]> {
        const account = await db.query.accounts.findFirst({
            where: (t, { eq }) => eq(t.phone, input.phone),
        });

        return account;
    },

    async findAccount(
        input: AuthRepositorySchemaType["findAccount"]["input"],
    ): Promise<AuthRepositorySchemaType["findAccount"]["output"]> {
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

    async findUser(
        input: AuthRepositorySchemaType["findUser"]["input"],
    ): Promise<AuthRepositorySchemaType["findUser"]["output"]> {
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

    async createAccount(
        data: AuthRepositorySchemaType["createAccount"]["input"],
    ): Promise<AuthRepositorySchemaType["createAccount"]["output"]> {
        const accountId = crypto.randomUUID();
        const sessionToken = generateBase64Token();

        await db.batch([
            db.insert(accounts).values({
                id: accountId,
                phone: data.phone,
                password: data.password,
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

    async createSession(
        data: AuthRepositorySchemaType["createSession"]["input"],
    ): Promise<AuthRepositorySchemaType["createSession"]["output"]> {
        const sessionToken = generateBase64Token();

        await db.insert(sessions).values({
            accountId: data.accountId,
            ipAddress: data.ipAddress,
            token: sessionToken,
            userAgent: data.userAgent,
        });

        return {
            token: sessionToken,
        };
    },

    async createUser(
        input: AuthRepositorySchemaType["createUser"]["input"],
    ): Promise<AuthRepositorySchemaType["createUser"]["output"]> {
        const [user] = await db.insert(users).values(input).returning({
            id: users.id,
            name: users.name,
            avatar: users.avatar,
        });

        return user;
    },

    async findAllSessions(
        input: AuthRepositorySchemaType["findAllSessions"]["input"],
    ): Promise<AuthRepositorySchemaType["findAllSessions"]["output"]> {
        const sessions = await db.query.sessions.findMany({
            where: (t, { eq }) => eq(t.accountId, input.accountId),
            columns: {
                accountId: false,
            },
        });

        return sessions;
    },

    async deleteSession(
        input: AuthRepositorySchemaType["deleteSession"]["input"],
    ) {
        await db
            .delete(sessions)
            .where(
                and(
                    eq(sessions.accountId, input.accountId),
                    eq(sessions.token, input.token),
                ),
            );
    },

    async logout(input: AuthRepositorySchemaType["logout"]["input"]) {
        await db.delete(sessions).where(eq(sessions.token, input.token));
    },
};
