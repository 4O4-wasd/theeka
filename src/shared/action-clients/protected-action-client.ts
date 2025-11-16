import { createSafeActionClient } from "next-safe-action";
import { a } from "./a";

export const protectedActionClient = createSafeActionClient().use(
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
