import type { ToFunctions } from "@/utils/types";
import { businessesRepository } from "./businesses.repository";
import type { BusinessesServiceSchemaType } from "./businesses.schema";

export const businessesService = {
    async create(input) {
        const business = await businessesRepository.create(input);
        return business;
    },

    async find(input) {
        const business = await businessesRepository.find(input);
        return business;
    },

    async findAll(input) {
        const businesses = await businessesRepository.findAll(input);
        return businesses;
    },

    async update(input) {
        const business = await businessesRepository.update(input);
        return business;
    },

    async delete(input) {
        await businessesRepository.delete(input);
    },
} satisfies ToFunctions<BusinessesServiceSchemaType>;
