import env from "@env";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { compress } from "hono/compress";
import { addressRoutes } from "./modules/address/address.routes";
import { authRoutes } from "./modules/auth/auth.routes";
import { businessRoutes } from "./modules/business/business.route";

const app = new Hono();

app.use(compress());

app.route("/auth", authRoutes);
app.route("/address", addressRoutes);
app.route("/business", businessRoutes)

if (env.NODE_ENV === "dev") {
    serve(
        {
            fetch: app.fetch,
            port: 3000,
        },
        (info) => {
            console.log(`Server is running on http://localhost:${info.port}`);
        },
    );
}

export default app;
