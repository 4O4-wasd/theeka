"use server";

import { database } from "@/shared";
import { professionalActionClient } from "@/shared/action-clients/professional-action-client";
import { schema } from "@/shared/db/schema";
import { createBusinessSchema } from "../schema/create-business-schema";

export const createNewBusiness = professionalActionClient
    .inputSchema(createBusinessSchema)
    .action(async ({ parsedInput: data, ctx: { professional } }) => {
        const id = crypto.randomUUID();
        await database.insert(schema.business).values({
            id,
            categoryNames: data.categoryNames,
            radius: data.radius,
            thumbnail: data.thumbnail,
            title: data.title,
            description: data.description,
            media: data.media,
            location: data.location,
            professionalId: professional.id,
        });
        return id;
    });
