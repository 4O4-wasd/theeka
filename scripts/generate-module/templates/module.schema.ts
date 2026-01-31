import type { DefaultSchemaType, InferSchema } from "@/utils/types";
import z from "zod";

const moduleSchema = {
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

export const moduleRouteSchema = moduleSchema.route();

type ModuleSchemaType = InferSchema<typeof moduleSchema>;

export type ModuleRepositorySchemaType = ModuleSchemaType["repository"];
export type ModuleServiceSchemaType = ModuleSchemaType["service"];
