import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { createSelectSchema } from "drizzle-zod";
import z from "zod";
import { businessAddressesTable } from "./business-addresses.table";
import { employeesTable } from "./employees.table";
import { ordersTable } from "./orders.table";
import { reviewsTable } from "./reviews.table";
import { usersTable } from "./users.table";

type BusinessHoursType = z.infer<typeof businessHoursSchema>;

export const businessesTable = sqliteTable("businesses", {
    id: text("id")
        .primaryKey()
        .$default(() => crypto.randomUUID()),
    ownerId: text("owner_id")
        .notNull()
        .references(() => usersTable.id, { onDelete: "cascade" }),
    phoneNumber: integer("phone_number").notNull(),
    businessHours: text("business_hours", {
        mode: "json",
    })
        .$type<BusinessHoursType>()
        .notNull(),
    media: text("media", {
        mode: "json",
    }).$type<
        {
            type: "image" | "video";
            url: string;
        }[]
    >(),
    isClosed: integer("is_closed", {
        mode: "boolean",
    })
        .notNull()
        .default(false),
    title: text("title").notNull(),
    logo: text("logo"),
    description: text("description"),
    createdAt: integer("created_at", { mode: "timestamp" })
        .notNull()
        .$defaultFn(() => new Date()),
});

export const businessesTableRelations = relations(
    businessesTable,
    ({ one, many }) => ({
        owner: one(usersTable, {
            fields: [businessesTable.ownerId],
            references: [usersTable.id],
        }),
        address: one(businessAddressesTable),
        employees: many(employeesTable),
        orders: many(ordersTable),
        reviews: many(reviewsTable),
    }),
);

const businessHoursSchema = z.record(
    z.enum([
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
        "sunday",
    ]),
    z.union([
        z.literal("closed"),
        z.literal("24 hours"),
        z.string().regex(/^\d+:\d+-\d+:\d+$/),
    ]),
);

const businessMediaSchema = z.object({
    type: z.enum(["image", "video"]),
    url: z.url(),
});

export const businessSchema = createSelectSchema(businessesTable, {
    id: z.uuid(),
    ownerId: z.uuid(),
    phoneNumber: z
        .number()
        .min(1000000000, "phone is not valid")
        .max(9999999999, "phone is not valid"),
    businessHours: businessHoursSchema,
    media: z.array(businessMediaSchema).optional().nullable(),
    isClosed: z.boolean(),
    title: z.string().min(2).max(50),
    logo: z.url().optional().nullable(),
    description: z.string().optional().nullable(),
    createdAt: z.date(),
});
