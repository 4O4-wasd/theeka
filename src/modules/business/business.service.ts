import type { ToFunctions } from "@/utils/types";
import { businessRepository } from "./business.repository";
import type { BusinessServiceSchemaType } from "./business.schema";

export const businessService = {
    async findAll(input) {
        return await businessRepository.findAll(input);
    },
} satisfies ToFunctions<BusinessServiceSchemaType>;
