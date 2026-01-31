import { relations } from "drizzle-orm";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import z from "zod";
import { businessAddresses } from "./business-addresses.schema";
import { employees } from "./employees.schema";
import { orders } from "./orders.schema";
import { reviews } from "./reviews.schema";
import { users } from "./users.schema";

type BusinessHoursType = z.infer<typeof BusinessHoursSchema>;

export const businesses = sqliteTable("businesses", {
    id: text("id")
        .primaryKey()
        .$default(() => crypto.randomUUID()),
    ownerId: text("owner_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
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

export const businessesRelations = relations(businesses, ({ one, many }) => ({
    owner: one(users, {
        fields: [businesses.ownerId],
        references: [users.id],
    }),
    address: one(businessAddresses),
    employees: many(employees),
    orders: many(orders),
    reviews: many(reviews),
}));

const BusinessHoursSchema = z.record(
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

const BusinessMediaSchema = z.object({
    type: z.enum(["image", "video"]),
    url: z.url(),
});

export const BusinessSchema = z.object({
    id: z.uuid(),
    ownerId: z.uuid(),
    phoneNumber: z
        .number()
        .min(1000000000, "phone is not valid")
        .max(9999999999, "phone is not valid"),
    businessHours: BusinessHoursSchema,
    media: z.array(BusinessMediaSchema).optional(),
    isClosed: z.boolean(),
    title: z.string().min(2).max(50),
    logo: z.url().optional(),
    description: z.string().optional(),
    createdAt: z.iso.datetime(),
});
