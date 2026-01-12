import { accountSchema, sessionSchema, userSchema } from "@/db/schema";
import { z } from "zod";

export const logInInputSchema = z.object({
    ...accountSchema.pick({
        password: true,
        phone: true,
    }).shape,
    ...sessionSchema.pick({
        ipAddress: true,
        userAgent: true,
    }).shape,
});

export const logInJsonSchema = logInInputSchema.pick({
    phone: true,
    password: true,
});

export const logInOutputSchema = sessionSchema.pick({
    token: true,
});

export const createAccountInputSchema = logInInputSchema;

export const createSessionInputSchema = z.object({
    ...logInInputSchema.pick({
        ipAddress: true,
        userAgent: true,
    }).shape,
    accountId: z.uuidv4(),
});

export type LogInInputSchemaType = z.infer<typeof logInInputSchema>;
export type LogInJsonSchemaType = z.infer<typeof logInJsonSchema>;
export type LogInOutputSchemaType = z.infer<typeof logInOutputSchema>;
export type CreateAccountInputSchemaType = z.infer<
    typeof createAccountInputSchema
>;
export type CreateSessionInputSchemaType = z.infer<
    typeof createSessionInputSchema
>;

////////////

export const createUserInputSchema = userSchema.pick({
    name: true,
    avatar: true,
    accountId: true,
});

export const createUserJsonSchema = createUserInputSchema.omit({
    accountId: true,
});

export const createUserOutputSchema = userSchema;

export type CreateUserInputSchemaType = z.infer<typeof createUserInputSchema>;
export type CreateUserJsonSchemaType = z.infer<typeof createUserJsonSchema>;
export type CreateUserOutputSchemaType = z.infer<typeof createUserOutputSchema>;
