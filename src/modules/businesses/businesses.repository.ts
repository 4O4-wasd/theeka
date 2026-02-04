import db from "@/db";
import { businesses } from "@/db/schema";
import { HTTP_STATUS } from "@/utils/status-codes";
import type { ToFunctions } from "@/utils/types";
import { and, eq } from "drizzle-orm";
import { HTTPException } from "hono/http-exception";
import type { BusinessesRepositorySchemaType } from "./businesses.schema";

export const businessesRepository = {
    async create(input) {
        const [business] = await db.insert(businesses).values(input).returning({
            id: businesses.id,
            phoneNumber: businesses.phoneNumber,
            businessHours: businesses.businessHours,
            media: businesses.media,
            isClosed: businesses.isClosed,
            title: businesses.title,
            logo: businesses.logo,
            description: businesses.description,
            createdAt: businesses.createdAt,
        });

        return business;
    },

    async find({ ownerId, id }) {
        const business = await db.query.businesses.findFirst({
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
        const businesses = await db.query.businesses.findMany({
            columns: {
                ownerId: false,
            },

            where: (t, { eq }) => eq(t.ownerId, ownerId),
        });

        return businesses;
    },

    async update({ id, ownerId, ...input }) {
        const [business] = await db
            .update(businesses)
            .set(input)
            .where(and(eq(businesses.id, id), eq(businesses.ownerId, ownerId)))
            .returning({
                id: businesses.id,
                phoneNumber: businesses.phoneNumber,
                businessHours: businesses.businessHours,
                media: businesses.media,
                isClosed: businesses.isClosed,
                title: businesses.title,
                logo: businesses.logo,
                description: businesses.description,
                createdAt: businesses.createdAt,
            });

        return business;
    },

    async delete({ id, ownerId }) {
        await db
            .delete(businesses)
            .where(and(eq(businesses.id, id), eq(businesses.ownerId, ownerId)));
    },
} satisfies ToFunctions<BusinessesRepositorySchemaType>;
