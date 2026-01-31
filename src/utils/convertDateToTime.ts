import { z } from "zod";

export const convertDateToISODateTime = (schema: any): z.ZodType => {
    if (schema instanceof z.ZodDate) {
        return z.iso.datetime();
    }

    if (schema instanceof z.ZodObject) {
        const newShape: z.ZodObject["shape"] = {};
        for (const key in schema.shape) {
            newShape[key] = convertDateToISODateTime(schema.shape[key]);
        }
        return z.object(newShape);
    }

    if (schema instanceof z.ZodArray) {
        return z.array(convertDateToISODateTime(schema.element));
    }

    if (schema instanceof z.ZodOptional) {
        return convertDateToISODateTime(schema.unwrap()).optional();
    }

    if (schema instanceof z.ZodNullable) {
        return convertDateToISODateTime(schema.unwrap()).nullable();
    }

    return schema;
};
