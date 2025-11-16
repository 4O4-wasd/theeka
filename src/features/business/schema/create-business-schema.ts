import { defaultBusinessSchema, defaultProfessionalSchema } from "@/shared/schemas";
import z from "zod";

export const createBusinessSchema = defaultBusinessSchema.omit({
    createdAt: true,
    updatedAt: true,
    id: true,
    professionalId: true,
    totalRating: true,
    totalReviews: true
});

export type CreateBusinessSchemaType = z.infer<typeof createBusinessSchema>;
