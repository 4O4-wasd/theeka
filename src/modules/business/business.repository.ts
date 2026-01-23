import type { ToFunctions } from "@/utils";
import type { BusinessRepositorySchemaType } from "./business.schema";

export const businessRepository = {
    async findAll(input) {
        return [{}];
    },
} satisfies ToFunctions<BusinessRepositorySchemaType>;
