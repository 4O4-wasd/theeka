import { getProfessional } from "@/features/professional/actions/get-professional";
import { protectedActionClient } from "./protected-action-client";

export const professionalActionClient = protectedActionClient.use(
    async ({ ctx, next }) => {
        const { data: professional } = await getProfessional();

        if (!professional) {
            throw new Error("You are not a Professional");
        }

        return next({
            ctx: {
                professional,
                ...ctx,
            },
        });
    }
);
