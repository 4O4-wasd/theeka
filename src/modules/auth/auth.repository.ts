import db from "@/db";
import {
    accounts,
    sessions,
    users,
    type AccountSchemaType,
    type UserSchemaType,
} from "@/db/schema";
import type {
    CreateAccountInputSchemaType,
    CreateSessionInputSchemaType,
    CreateUserInputSchemaType,
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

        if (!account || !account.user) {
            return;
        }

        const { user, ...accountWithoutUser } = account;
        return {
            account: accountWithoutUser,
            user,
        };
    }

    async createAccount(data: CreateAccountInputSchemaType) {
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

    async createSession(data: CreateSessionInputSchemaType) {
        const sessionToken = generateBase64Token();

        await db.insert(sessions).values({
            accountId: data.accountId,
            ipAddress: data.ipAddress,
            token: sessionToken,
            userAgent: data.userAgent,
        });

        return sessionToken;
    }

    async createUser(data: CreateUserInputSchemaType): Promise<UserSchemaType> {
        const [user] = await db.insert(users).values(data).returning();
        return user;
    }
}
