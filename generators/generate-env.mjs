import "dotenv/config";
import fs from "node:fs";

const fileData = JSON.stringify(process.env, undefined, 2)

try {
    fs.writeFileSync(process.cwd() + "/src/shared/constants/env.ts", `export const env = ${fileData} as const`);
    console.log("Generate env successfully")
} catch {
    console.error("Failed to generate env")
}
