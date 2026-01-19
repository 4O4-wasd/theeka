import { HTTP_STATUS } from "@/status-codes";
import argon2 from "argon2";
import { HTTPException } from "hono/http-exception";
import { authRepository } from "./auth.repository";
import type { AuthServiceSchemaType } from "./auth.schema";

export const authService = {
    async findAccountByPhone(
        input: AuthServiceSchemaType["findAccountByPhone"]["input"],
    ): Promise<AuthServiceSchemaType["findAccountByPhone"]["output"]> {
        const account = await authRepository.findAccountByPhone(input);
        return account;
    },

    async findAccount(
        input: AuthServiceSchemaType["findAccount"]["input"],
    ): Promise<AuthServiceSchemaType["findAccount"]["output"]> {
        const account = await authRepository.findAccount(input);
        return account;
    },

    async findUser(
        input: AuthServiceSchemaType["findUser"]["input"],
    ): Promise<AuthServiceSchemaType["findUser"]["output"]> {
        const user = await authRepository.findUser(input);
        return user;
    },

    async login(
        input: AuthServiceSchemaType["login"]["input"],
    ): Promise<AuthServiceSchemaType["login"]["output"]> {
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

            const token = await authRepository.createSession({
                accountId: account.id,
                ipAddress: input.ipAddress,
                userAgent: input.userAgent,
            });

            return token;
        }

        const hashedPassword = await argon2.hash(input.password);
        const token = await authRepository.createAccount({
            ...input,
            password: hashedPassword,
        });

        return token;
    },

    async createUser(
        input: AuthServiceSchemaType["createUser"]["input"],
    ): Promise<AuthServiceSchemaType["createUser"]["output"]> {
        const user = await authRepository.createUser(input);

        return user;
    },

    async findAllSessions(
        input: AuthServiceSchemaType["findAllSessions"]["input"],
    ): Promise<AuthServiceSchemaType["findAllSessions"]["output"]> {
        const sessions = await authRepository.findAllSessions(input);

        return sessions;
    },

    async deleteSession(
        input: AuthServiceSchemaType["deleteSession"]["input"],
    ) {
        await authRepository.deleteSession(input);
    },

    async logout(input: AuthServiceSchemaType["logout"]["input"]) {
        await authRepository.logout(input);
    },
};
