import env from "@env";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { compress } from "hono/compress";
import { addressesRoutes } from "./modules/addresses/addresses.routes";
import { authRoutes } from "./modules/auth/auth.routes";
import { businessesRoutes } from "./modules/businesses/businesses.route";

const app = new Hono();

app.use(compress());

app.route("/auth", authRoutes);
app.route("/addresses", addressesRoutes);
app.route("/businesses", businessesRoutes);

if (env.NODE_ENV === "dev") {
    serve(
        {
            fetch: app.fetch,
            port: 3001,
        },
        (info) => {
            console.log(`Server is running on http://localhost:${info.port}`);
        },
    );
}

export default app;
