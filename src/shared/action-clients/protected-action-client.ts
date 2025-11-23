import { a } from "./a";
import { defaultActionClient } from "./default-action-client";

export const protectedActionClient = defaultActionClient.use(
    async ({ next }) => {
        const session = await a();
        if (!session || session.user.name === "") {
            throw new Error("You are not logged in");
        }

        return next({
            ctx: {
                user: session.user,
                session: session.session,
            },
        });
    }
);
