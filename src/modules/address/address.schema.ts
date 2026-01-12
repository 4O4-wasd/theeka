import { userAddressSchema } from "@/db/schema";
import type z from "zod";

export const createAddressSchema = userAddressSchema.omit({
    id: true,
});

export const createAddressInputSchema = createAddressSchema.omit({
    userId: true,
});

export const createAddressOutputSchema = userAddressSchema;

export type CreateAddressSchemaType = z.infer<typeof createAddressSchema>;
export type CreateAddressInputSchemaType = z.infer<
    typeof createAddressInputSchema
>;
export type CreateAddressOutputSchemaType = z.infer<
    typeof createAddressOutputSchema
>;

export const updateAddressSchema = userAddressSchema
    .omit({
        userId: true,
        id: true,
    })
    .partial();

export const updateAddressInputSchema = updateAddressSchema;

export const updateAddressOutputSchema = userAddressSchema;

export type UpdateAddressSchemaType = z.infer<typeof updateAddressSchema>;
export type UpdateAddressInputSchemaType = z.infer<
    typeof updateAddressInputSchema
>;
export type UpdateAddressOutputSchemaType = z.infer<
    typeof updateAddressOutputSchema
>;
