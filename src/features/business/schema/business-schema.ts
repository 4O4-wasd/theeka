import {
    defaultBusinessSchema,
    defaultProfessionalSchema,
} from "@/shared/schemas";
import z from "zod";

export const businessSchema = defaultBusinessSchema.extend({
    professional: defaultProfessionalSchema.omit({
        userId: true,
        createdAt: true,
    }),
});

export type BusinessSchemaType = z.infer<typeof businessSchema>;
