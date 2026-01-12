import db from "@/db";
import {
    accounts,
    sessions,
    users,
    type AccountSchemaType,
    type UserSchemaType,
} from "@/db/schema";
import type {
    CreateAccountSchemaType,
    CreateSessionSchemaType,
    CreateUserSchemaType,
} from "./auth.schema";
import { generateBase64Token } from "./auth.utils";

export class AuthRepository {
    async findAccountByPhone(
        phone: number
    ): Promise<AccountSchemaType | undefined> {
        const account = await db.query.accounts.findFirst({
            where: (t, { eq }) => eq(t.phone, phone),
        });
        return account;
    }

    async findAccount(token: string): Promise<AccountSchemaType | undefined> {
        const session = await db.query.sessions.findFirst({
            where: (t, { eq }) => eq(t.token, token),
            with: {
                account: true,
            },
        });
        return session?.account;
    }

    async findUser(
        token: string
    ): Promise<
        { user: UserSchemaType; account: AccountSchemaType } | undefined
    > {
        const session = await db.query.sessions.findFirst({
            where: (t, { eq }) => eq(t.token, token),
            with: {
                account: {
                    with: {
                        user: true,
                    },
                },
            },
        });

        const account = session?.account;
        const user = session?.account.user ?? undefined;

        if (!account || !user) {
            return;
        }

        return {
            account,
            user,
        };
    }

    async createAccount(data: CreateAccountSchemaType) {
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

        return sessionToken;
    }

    async createSession(data: CreateSessionSchemaType) {
        const sessionToken = generateBase64Token();

        await db.insert(sessions).values({
            accountId: data.accountId,
            ipAddress: data.ipAddress,
            token: sessionToken,
            userAgent: data.userAgent,
        });

        return sessionToken;
    }

    async createUser(data: CreateUserSchemaType): Promise<UserSchemaType> {
        const id = crypto.randomUUID();
        await db.insert(users).values({
            id,
            ...data,
        });

        return {
            id,
            ...data,
        };
    }
}
