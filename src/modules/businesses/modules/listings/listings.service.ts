import db from "@/db";
import { businessListings } from "@/db/schema";
import { selectTableColumns } from "@/utils/select-table-columns";
import { HTTP_STATUS } from "@/utils/status-codes";
import type { ToFunctions } from "@/utils/types";
import { and, eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";
import type { ListingsServiceSchemaType } from "./listings.schema";

export const listingsService = {
    async create(input) {
        const [listing] = await db
            .insert(businessListings)
            .values(input)
            .returning(
                selectTableColumns(businessListings, "omit", {
                    businessId: true,
                }),
            );

        return listing;
    },

    async find({ businessId, id }) {
        const listing = await db.query.businessListings.findFirst({
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
        const listings = await db.query.businessListings.findMany({
            columns: {
                businessId: false,
            },

            where: (t, { eq }) => eq(t.businessId, businessId),
        });

        return listings;
    },

    async update({ id, businessId, ...input }) {
        const [listings] = await db
            .update(businessListings)
            .set(input)
            .where(
                and(
                    eq(businessListings.id, id),
                    eq(businessListings.businessId, businessId),
                ),
            )
            .returning(
                selectTableColumns(businessListings, "omit", {
                    businessId: true,
                }),
            );

        return listings;
    },

    async delete({ id, businessId }) {
        await db
            .delete(businessListings)
            .where(
                and(
                    eq(businessListings.id, id),
                    eq(businessListings.businessId, businessId),
                ),
            );
    },
} satisfies ToFunctions<ListingsServiceSchemaType>;
