import fs from "fs";
import { generateSpecs } from "hono-openapi";
import path from "path";
import app from "..";

const publicDirPath = path.join(process.cwd(), "public");
const filePath = path.join(publicDirPath, "openapi.json");

const specs = await generateSpecs(app, {
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
});

if (!fs.existsSync(publicDirPath)) {
    fs.mkdirSync(publicDirPath, { recursive: true });
}

fs.writeFileSync(filePath, JSON.stringify(specs, undefined, 2));

console.log("openapi.json generated");

process.exit(0);
