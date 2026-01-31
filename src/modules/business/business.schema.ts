import { businessSchema as BSchema } from "@/db/schema";
import type { DefaultSchemaType, InferSchema } from "@/utils/types";
import z from "zod";

const businessSchema = {
    repository() {
        return {
            create: {
                input: BSchema,
            },
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

export const businessRouteSchema = businessSchema.route();

type BusinessSchemaType = InferSchema<typeof businessSchema>;

export type BusinessRepositorySchemaType = BusinessSchemaType["repository"];
export type BusinessServiceSchemaType = BusinessSchemaType["service"];
