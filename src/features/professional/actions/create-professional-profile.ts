"use server";

import { protectedActionClient } from "@/shared";
import { schema } from "@/shared/db/schema";
import { createProfessionalProfileSchema } from "../schema/create-professional";
import { database } from "@/shared/db";

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
