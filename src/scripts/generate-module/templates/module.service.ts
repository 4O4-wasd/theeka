import type { ToFunctions } from "@/utils/types";
import { moduleRepository } from "./module.repository";
import type { ModuleServiceSchemaType } from "./module.schema";

export const moduleService = {
    async findAll(input) {
        return await moduleRepository.findAll(input);
    },
} satisfies ToFunctions<ModuleServiceSchemaType>;
