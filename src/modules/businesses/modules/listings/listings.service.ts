import db from "@/db";
import { businessListingsTable } from "@/db/tables";
import { selectTableColumns } from "@/utils/select-table-columns";
import { HTTP_STATUS } from "@/utils/status-codes";
import type { ToFunctions } from "@/utils/types";
import { and, eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";
import type { ListingsServiceSchemaType } from "./listings.schema";

export const listingsService = {
    async create(input) {
        const [listing] = await db
            .insert(businessListingsTable)
            .values(input)
            .returning(
                selectTableColumns(businessListingsTable, "omit", {
                    businessId: true,
                }),
            );

        return listing;
    },

    async find({ businessId, id }) {
        const listing = await db.query.businessListingsTable.findFirst({
            columns: {
                businessId: false,
            },

            where: (t, { eq, and }) =>
                and(eq(t.id, id), eq(t.businessId, businessId)),
        });

        if (!listing) {
            throw new HTTPException(HTTP_STATUS["Not Found"], {
                message: "Listing not found",
            });
        }

        return listing;
    },

    async findAll({ businessId }) {
        const listings = await db.query.businessListingsTable.findMany({
            columns: {
                businessId: false,
            },

            where: (t, { eq }) => eq(t.businessId, businessId),
        });

        return listings;
    },

    async update({ id, businessId, ...input }) {
        const [listings] = await db
            .update(businessListingsTable)
            .set(input)
            .where(
                and(
                    eq(businessListingsTable.id, id),
                    eq(businessListingsTable.businessId, businessId),
                ),
            )
            .returning(
                selectTableColumns(businessListingsTable, "omit", {
                    businessId: true,
                }),
            );

        return listings;
    },

    async delete({ id, businessId }) {
        await db
            .delete(businessListingsTable)
            .where(
                and(
                    eq(businessListingsTable.id, id),
                    eq(businessListingsTable.businessId, businessId),
                ),
            );
    },
} satisfies ToFunctions<ListingsServiceSchemaType>;
