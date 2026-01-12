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

///////////////////////////////////

export const findAddressSchema = userAddressSchema.pick({
    id: true,
    userId: true
})

export const findAddressParamSchema = findAddressSchema.pick({
    id: true,
});

export const findAddressResponseSchema = userAddressSchema;

export type FindAddressSchemaType = z.infer<typeof findAddressSchema>;
export type FindAddressParamSchemaType = z.infer<typeof findAddressParamSchema>;
export type FindAddressResponseSchemaType = z.infer<
    typeof findAddressResponseSchema
>;

///////////////////////////////////

export const updateAddressSchema = userAddressSchema.partial().required({
    userId: true,
    id: true,
});

export const updateAddressInputSchema = updateAddressSchema.omit({
    userId: true,
    id: true,
});

export const updateAddressParamSchema = userAddressSchema.pick({
    id: true,
});

export const updateAddressOutputSchema = userAddressSchema;

export type UpdateAddressSchemaType = z.infer<typeof updateAddressSchema>;
export type UpdateAddressInputSchemaType = z.infer<
    typeof updateAddressInputSchema
>;
export type UpdateAddressParamSchemaType = z.infer<
    typeof updateAddressParamSchema
>;
export type UpdateAddressOutputSchemaType = z.infer<
    typeof updateAddressOutputSchema
>;
