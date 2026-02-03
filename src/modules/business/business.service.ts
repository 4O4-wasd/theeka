import type { ToFunctions } from "@/utils/types";
import { businessRepository } from "./business.repository";
import type { BusinessServiceSchemaType } from "./business.schema";

export const businessService = {
    async create(input) {
        const business = await businessRepository.create(input);
        return business;
    },

    async find(input) {
        const business = await businessRepository.find(input);
        return business;
    },

    async findAll(input) {
        const businesses = await businessRepository.findAll(input);
        return businesses;
    },

    async update(input) {
        const business = await businessRepository.update(input);
        return business;
    },

    async delete(input) {
        await businessRepository.delete(input);
    },
} satisfies ToFunctions<BusinessServiceSchemaType>;
