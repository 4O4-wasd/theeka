import type { ToFunctions } from "@/utils/types";
import { listingsRepository } from "./listings.repository";
import type { ListingsServiceSchemaType } from "./listings.schema";

export const listingsService = {
    async create(input) {
        const listing = await listingsRepository.create(input);
        return listing;
    },

    async find(input) {
        const listing = await listingsRepository.find(input);
        return listing;
    },

    async findAll(input) {
        const listings = await listingsRepository.findAll(input);
        return listings;
    },

    async update(input) {
        const listing = await listingsRepository.update(input);
        return listing;
    },

    async delete(input) {
        await listingsRepository.delete(input);
    },
} satisfies ToFunctions<ListingsServiceSchemaType>;
