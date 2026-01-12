import env from "@env";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { authRoutes } from "./modules/auth/auth.routes";

const app = new Hono();

app.route("/auth", authRoutes);

if (env.NODE_ENV === "dev") {
    serve(
        {
            fetch: app.fetch,
            port: 3000,
        },
        (info) => {
            console.log(`Server is running on http://localhost:${info.port}`);
        }
    );
}

export default app;
