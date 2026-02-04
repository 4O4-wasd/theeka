import type { ToFunctions } from "@/utils/types";
import { listingsRepository } from "./listings.repository";
import type { ListingsServiceSchemaType } from "./listings.schema";

export const listingsService = {
    async findAll(input) {
        return await listingsRepository.findAll(input);
    },
} satisfies ToFunctions<ListingsServiceSchemaType>;
