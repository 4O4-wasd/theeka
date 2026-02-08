import type { DefaultSchemaType, InferSchema } from "@/utils/types";
import z from "zod";

const schema = {
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
            "GET /": {
                description: "Find All BusinessAddress",
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

export const businessAddressRouteSchema = schema.route();

type BusinessAddressSchemaType = InferSchema<typeof schema>;

export type BusinessAddressRepositorySchemaType =
    BusinessAddressSchemaType["repository"];
export type BusinessAddressServiceSchemaType =
    BusinessAddressSchemaType["service"];
