import { AuthRepository } from "./auth.repository";
import type {
    CreateUserInputSchemaType,
    LogInInputSchemaType,
} from "./auth.schema";

export class AuthService {
    private repository: AuthRepository;

    constructor() {
        this.repository = new AuthRepository();
    }

    async findAccountByPhone(phone: number) {
        const account = await this.repository.findAccountByPhone(phone);
        return account;
    }

    async findAccount(token: string) {
        const account = await this.repository.findAccount(token);
        return account;
    }

    async findUser(token: string) {
        const user = await this.repository.findUser(token);
        return user;
    }

    async logIn(data: LogInInputSchemaType) {
        const account = await this.findAccountByPhone(data.phone);

        if (account) {
            const token = await this.repository.createSession({
                accountId: account.id,
                ipAddress: data.ipAddress,
                userAgent: data.userAgent,
            });
            return token;
        }

        const token = await this.repository.createAccount(data);
        return token;
    }

    async createUser(data: CreateUserInputSchemaType) {
        const user = await this.repository.createUser(data);
        return user;
    }
}
