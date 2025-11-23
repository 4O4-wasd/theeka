"use server";

import { protectedActionClient } from "@/shared";
import { database } from "@/shared/db";
import { cache } from "react";

export const getProfessional = cache(protectedActionClient.action(async ({ ctx }) => {
    const professional = await database.query.professional.findFirst({
        where(fields, { sql }) {
            return sql`${fields.userId} = ${ctx.user.id}`;
        },
    });

    return professional;
}));
