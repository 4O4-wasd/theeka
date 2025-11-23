import { createSelectSchema } from "drizzle-zod";
import z from "zod";
import { schema } from "../db/schema";

export const idSchema = (name: string = "Id") =>
    z
        .uuidv4(`${name} is not a UUID`)
        .nonempty(`${name} is empty`)
        .nonoptional(`${name} is not empty`);

export const defaultUserSchema = createSelectSchema(schema.user, {
    id: idSchema(),
    email: z.email(),
    emailVerified: z.boolean(),
    name: z.string().min(2).max(50),
    image: z.url().optional().nullable(),
});

export const defaultSessionSchema = createSelectSchema(schema.session, {
    id: idSchema(),
    ipAddress: z.ipv4().optional(),
    userAgent: z.string().optional(),
    userId: idSchema("User Id"),
    token: z.string(),
    expiresAt: z.date(),
});

export const defaultProfessionalSchema = createSelectSchema(
    schema.professional,
    {
        id: idSchema(),
        professionalName: z.string().min(2).max(50),
        phoneNumbers: z
            .array(
                z
                    .int("Invalid Phone Number")
                    .min(1000000000, "Invalid Phone Number")
                    .max(9999999999, "Invalid Phone Number")
            )
            .min(1),
        userId: idSchema("User Id"),
    }
);

export const defaultBusinessSchema = createSelectSchema(schema.business, {
    id: idSchema(),
    title: z.string(),
    totalRating: z.number().nullable(),
    totalReviews: z.number().nullable(),
    description: z.string().nullable(),
    professionalId: idSchema("Professional Id"),
    thumbnail: z.url(),
    media: z.array(
        z.object({
            type: z.union([z.literal("image"), z.literal("video")]),
            url: z.url(),
        })
    ),
    categoryNames: z.array(z.string()).min(1),
    location: z.object({
        name: z.string(),
        country: z.string(),
        state: z.string().optional(),
        type: z.string(),
        postcode: z.string().optional(),
        city: z.string().optional(),
        county: z.string().optional(),
        coordinates: z.array(z.number()).length(2),
    }),
    radius: z.number("Radius is required").min(1),
});

export type DefaultBusinessSchemaType = z.infer<typeof defaultBusinessSchema>;
