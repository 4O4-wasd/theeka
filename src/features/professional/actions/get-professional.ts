"use server";

import { database, protectedActionClient } from "@/shared";
import z from "zod";

export const getProfessional = protectedActionClient.action(async ({ ctx }) => {
    const professional = await database.query.professional.findFirst({
        where(fields, { sql }) {
            return sql`${fields.userId} = ${ctx.user.id}`;
        },
    });

    return professional;
});
