import { accountSchema, sessionSchema, userSchema } from "@/db/schema";
import { z } from "zod";

export const logInSchema = z.object({
    ...accountSchema.pick({
        password: true,
        phone: true,
    }).shape,
    ...sessionSchema.pick({
        ipAddress: true,
        userAgent: true,
    }).shape,
});

export const logInInputSchema = logInSchema.pick({
    phone: true,
    password: true,
});

export const logInOutputSchema = sessionSchema.pick({
    token: true,
});

export const createAccountSchema = logInSchema;

export const createSessionSchema = z.object({
    ...logInSchema.pick({
        ipAddress: true,
        userAgent: true,
    }).shape,
    accountId: z.uuidv4(),
});

export type LogInSchemaType = z.infer<typeof logInSchema>;
export type LogInInputSchemaType = z.infer<typeof logInInputSchema>;
export type LogInOutputSchemaType = z.infer<typeof logInOutputSchema>;
export type CreateAccountSchemaType = z.infer<typeof createAccountSchema>;
export type CreateSessionSchemaType = z.infer<typeof createSessionSchema>;

export const createUserSchema = userSchema.pick({
    name: true,
    avatar: true,
    accountId: true,
});

export const createUserInputSchema = createUserSchema;
export const createUserOutputSchema = userSchema;

export type CreateUserSchemaType = z.infer<typeof createUserSchema>;
export type CreateUserInputSchemaType = z.infer<typeof createUserInputSchema>;
export type CreateUserOutputSchemaType = z.infer<typeof createUserOutputSchema>;
