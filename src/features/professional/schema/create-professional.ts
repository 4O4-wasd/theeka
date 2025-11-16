import { defaultProfessionalSchema } from "@/shared/schemas";
import z from "zod";

export const createProfessionalProfileSchema = defaultProfessionalSchema.pick({
    phoneNumbers: true,
    professionalName: true,
});

export type CreateProfessionalProfileFormValues = z.infer<typeof createProfessionalProfileSchema>;
