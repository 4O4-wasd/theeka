"use server";

import { professionalActionClient } from "@/shared/action-clients/professional-action-client";
import { database } from "@/shared/db";
import { cache } from "react";

export const getAllBusinesses = cache(
    professionalActionClient.action(async ({ ctx: { professional } }) => {
        const businesses = await database.query.business.findMany({
            where: ({ professionalId }, { sql }) =>
                sql`${professionalId} = ${professional.id}`,
            orderBy: ({ createdAt }, { asc }) => asc(createdAt),
        });
        return businesses;
    })
);
