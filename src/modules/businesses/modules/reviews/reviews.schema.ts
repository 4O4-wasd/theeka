import type { DefaultSchemaType, InferSchema } from "@/utils/types";
import z from "zod";

const schema = {
    service() {
        return {
            findAll: {
                input: z.object(),
                output: z.array(z.object()),
            },
        } satisfies DefaultSchemaType.Service;
    },

    route() {
        return {
            "GET /": {
                description: "Find All Reviews",
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

export const reviewsRouteSchema = schema.route();

type ReviewsSchemaType = InferSchema<typeof schema>;

export type ReviewsServiceSchemaType = ReviewsSchemaType["service"];
