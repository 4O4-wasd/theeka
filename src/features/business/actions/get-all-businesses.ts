"use server";

import { database } from "@/shared";
import { professionalActionClient } from "@/shared/action-clients/professional-action-client";

export const getAllBusinesses = professionalActionClient.action(
    async ({ ctx: { professional } }) => {
        const businesses = await database.query.business.findMany({
            where: ({ professionalId }, { sql }) =>
                sql`${professionalId} = ${professional.id}`,
            orderBy: ({ createdAt }, { asc }) => asc(createdAt),
        });
        return businesses;
    }
);
