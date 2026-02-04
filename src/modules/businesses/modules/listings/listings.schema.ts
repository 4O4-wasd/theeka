import type { DefaultSchemaType, InferSchema } from "@/utils/types";
import z from "zod";

const listingsSchema = {
    repository() {
        return {
            findAll: {
                input: z.object(),
                output: z.array(z.object()),
            },
        } satisfies DefaultSchemaType.Repository;
    },

    service() {
        return {
            findAll: this.repository().findAll,
        } satisfies DefaultSchemaType.Service;
    },

    route() {
        return {
            findAll: {
                request: {
                    json: this.service().findAll.input,
                },
                response: {
                    OK: this.service().findAll.output,
                },
            },
        } satisfies DefaultSchemaType.Route;
    },
};

export const listingsRouteSchema = listingsSchema.route();

type ListingsSchemaType = InferSchema<typeof listingsSchema>;

export type ListingsRepositorySchemaType = ListingsSchemaType["repository"];
export type ListingsServiceSchemaType = ListingsSchemaType["service"];
