import type { ToFunctions } from "@/utils/types";
import type { BusinessRepositorySchemaType } from "./business.schema";

export const businessRepository = {
    async findAll(input) {
        return [{}];
    },

    async create(input) {},
} satisfies ToFunctions<BusinessRepositorySchemaType>;
