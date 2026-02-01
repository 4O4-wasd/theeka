import env from "@env";
import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { openAPIRouteHandler } from "hono-openapi";
import { compress } from "hono/compress";
import { addressRoutes } from "./modules/address/address.routes";
import { authRoutes } from "./modules/auth/auth.routes";

const app = new Hono();

app.use(compress());

app.route("/auth", authRoutes);
app.route("/address", addressRoutes);

app.get(
    "/openapi",
    openAPIRouteHandler(app, {
        documentation: {
            info: {
                title: "Theeka API",
                version: "0.0.1",
                description: "Theeka API",
            },
            servers: [
                { url: "http://localhost:3000", description: "Local Server" },
            ],
        },
    }),
);

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
