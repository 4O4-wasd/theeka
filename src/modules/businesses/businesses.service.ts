import db from "@/db";
import { businessesTable } from "@/db/tables";
import { selectTableColumns } from "@/utils/select-table-columns";
import { HTTP_STATUS } from "@/utils/status-codes";
import type { ToFunctions } from "@/utils/types";
import { and, eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";
import type { BusinessesServiceSchemaType } from "./businesses.schema";

export const businessesService = {
    async create(input) {
        const [business] = await db
            .insert(businessesTable)
            .values(input)
            .returning(
                selectTableColumns(businessesTable, "omit", {
                    ownerId: true,
                }),
            );

        return business;
    },

    async find({ ownerId, id }) {
        const business = await db.query.businessesTable.findFirst({
            columns: {
                ownerId: false,
            },

            where: (t, { eq, and }) =>
                and(eq(t.id, id), eq(t.ownerId, ownerId)),
        });

        if (!business) {
            throw new HTTPException(HTTP_STATUS["Not Found"], {
                message: "Business not found",
            });
        }

        return business;
    },

    async findAll({ ownerId }) {
        const businesses = await db.query.businessesTable.findMany({
            columns: {
                ownerId: false,
            },

            where: (t, { eq }) => eq(t.ownerId, ownerId),
        });

        return businesses;
    },

    async update({ id, ownerId, ...input }) {
        const [business] = await db
            .update(businessesTable)
            .set(input)
            .where(
                and(
                    eq(businessesTable.id, id),
                    eq(businessesTable.ownerId, ownerId),
                ),
            )
            .returning(
                selectTableColumns(businessesTable, "omit", {
                    ownerId: true,
                }),
            );

        return business;
    },

    async delete({ id, ownerId }) {
        await db
            .delete(businessesTable)
            .where(
                and(
                    eq(businessesTable.id, id),
                    eq(businessesTable.ownerId, ownerId),
                ),
            );
    },
} satisfies ToFunctions<BusinessesServiceSchemaType>;
