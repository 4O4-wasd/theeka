import type { ToFunctions } from "@/utils/types";
import type { ReviewsServiceSchemaType } from "./reviews.schema";

export const reviewsService = {
    async findAll(input) {
        return [{}];
    },
} satisfies ToFunctions<ReviewsServiceSchemaType>;
