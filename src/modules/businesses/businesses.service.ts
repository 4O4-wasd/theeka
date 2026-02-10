import db from "@/db";
import { businessesTable } from "@/db/tables";
import { HTTP_STATUS } from "@/utils/status-codes";
import type { ToFunctions } from "@/utils/types";
import { eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";
import type { BusinessesServiceSchemaType } from "./businesses.schema";
import { employeesService } from "./modules/employees/employees.service";

export const businessesService = {
    async create({ userId, ...input }) {
        const [business] = await db
            .insert(businessesTable)
            .values(input)
            .returning();

        await employeesService.create({
            role: "owner",
            userId,
            businessId: business.id,
        });

        return business;
    },

    async find({ id }) {
        const business = await db.query.businessesTable.findFirst({
            where: (t, { eq }) => eq(t.id, id),
        });

        if (!business) {
            throw new HTTPException(HTTP_STATUS["Not Found"], {
                message: "Business not found",
            });
        }

        return business;
    },

    async findAll({ userId }) {
        const employees = await db.query.employeesTable.findMany({
            columns: {},

            with: {
                business: true,
            },

            where: (t, { eq }) => eq(t.userId, userId),
        });

        const businesses = employees.map((e) => e.business);

        return businesses;
    },

    async update({ id, userId, ...input }) {
        const [business] = await db
            .update(businessesTable)
            .set(input)
            .where(eq(businessesTable.id, id))
            .returning();

        return business;
    },

    async delete({ id, userId }) {
        await db.delete(businessesTable).where(eq(businessesTable.id, id));
    },
} satisfies ToFunctions<BusinessesServiceSchemaType>;
