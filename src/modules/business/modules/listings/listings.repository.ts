import type { ToFunctions } from "@/utils/types";
import type { ListingsRepositorySchemaType } from "./listings.schema";

export const listingsRepository = {
    async findAll(input) {
        return [{}];
    },
} satisfies ToFunctions<ListingsRepositorySchemaType>;
