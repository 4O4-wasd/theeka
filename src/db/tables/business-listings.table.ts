import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createSelectSchema } from "drizzle-zod";
import z from "zod";
import { businessesTable } from "./businesses.table";
import { ordersTable } from "./orders.table";
import { reviewsTable } from "./reviews.table";

export const businessListingsTable = sqliteTable("business_listings", {
    id: text("id")
        .primaryKey()
        .$default(() => crypto.randomUUID()),
    businessId: text("business_id")
        .notNull()
        .references(() => businessesTable.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description"),
    productSpecs: text("product_specs", {
        mode: "json",
    }).$type<Record<string, Record<string, string>>>(),
    logo: text("logo"),
    price: text("price").notNull(),
    categories: text("categories", {
        mode: "json",
    })
        .$type<string[]>()
        .notNull(),
    tags: text("tags", {
        mode: "json",
    })
        .$type<string[]>()
        .notNull(),
    type: text("type", {
        enum: ["product", "service"],
    }).notNull(),
    media: text("media", {
        mode: "json",
    }).$type<z.infer<typeof businessListingsMediaSchema>[]>(),
    stock: integer("stock"),
    available: integer("available", { mode: "boolean" }),
    createdAt: integer("created_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date()),
});

export const businessListingsTableRelations = relations(
    businessListingsTable,
    ({ one, many }) => ({
        business: one(businessesTable, {
            fields: [businessListingsTable.businessId],
            references: [businessesTable.id],
        }),
        orders: many(ordersTable),
        reviews: many(reviewsTable),
    }),
);

export const businessListingsMediaSchema = z.object({
    type: z.enum(["image", "video"]),
    url: z.string(),
});

export const businessListingsSchema = createSelectSchema(
    businessListingsTable,
    {
        id: z.uuid(),
        businessId: z.string(),
        title: z.string(),
        description: z.string().nullable().optional(),
        productSpecs: z
            .record(z.string(), z.record(z.string(), z.string()))
            .nullable()
            .optional(),
        logo: z.string().nullable().optional(),
        price: z.string(),
        categories: z.array(z.string()).min(1).max(20),
        tags: z.array(z.string()).min(1).max(20),
        type: z.enum(["product", "service"]),
        media: z.array(businessListingsMediaSchema).nullable().optional(),
        stock: z.number().int().nullable().optional(),
        available: z.boolean().nullable().optional(),
        createdAt: z.date(),
    },
);
