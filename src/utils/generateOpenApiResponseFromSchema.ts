import type { ValidationTargets } from "hono";
import { resolver } from "hono-openapi";
import z from "zod";
import { HTTP_STATUS } from "../status-codes";
import { convertDateToISODateTime } from "./convertDateToTime";

export const generateOpenApiResponseFromSchema = <
    T extends Partial<Record<keyof typeof HTTP_STATUS, z.ZodType>>,
>(
    responseSchema: T,
) => {
    return Object.fromEntries(
        Object.entries(responseSchema).map(([key, schema]) => [
            HTTP_STATUS[key as keyof typeof HTTP_STATUS],
            {
                description: key,
                content: {
                    "application/json": {
                        schema: resolver(convertDateToISODateTime(schema)),
                    },
                },
            },
        ]),
    );
};
