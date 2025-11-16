"use server";

import { database, protectedActionClient } from "@/shared";
import { schema } from "@/shared/db/schema";
import { createProfessionalProfileSchema } from "../schema/create-professional";

export const createProfessionalProfile = protectedActionClient
    .inputSchema(createProfessionalProfileSchema)
    .action(async ({ parsedInput: data, ctx: { user } }) => {
        const [professional] = await database
            .insert(schema.professional)
            .values({
                userId: user.id,
                ...data,
            })
            .onConflictDoNothing()
            .returning();
        
        return professional;
    });
