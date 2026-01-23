#!/usr/bin/env node
//@ts-check

import fs from "fs";
import path from "path";

const args = process.argv.slice(2);

if (args.length === 0) {
  console.log(`
Usage:
  npm run gm <module-name>              # Create main module
  npm run gm <parent>/<sub-module>      # Create sub-module

Examples:
  npm run gm products
  npm run gm users/addresses
  npm run gm businesses/listings
  `);
  process.exit(1);
}

const modulePath = args[0];
const parts = modulePath.replace("/", "/modules/").split("/");
const moduleName = parts[parts.length - 1];

const basePath = path.join(process.cwd(), "src", "modules", ...parts);
const templatesPath = path.join(process.cwd(), "scripts", "generate-module", "templates");

if (!fs.existsSync(basePath)) {
  fs.mkdirSync(basePath, { recursive: true });
  console.log(`Created directory: ${basePath}`);
} else {
  console.log(`Directory already exists: ${basePath}`);
}

/**
 * @param {string} str
 * @returns {string}
*/
const capitalize = (str) => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}


const fileNames = fs.readdirSync(templatesPath)

/** @type {{name: string, content: string}[]} */
const files = fileNames.map(fileName => {
  const filePath = path.join(templatesPath, fileName)
  const fileContent = fs.readFileSync(filePath, "utf-8").replaceAll("module", moduleName).replaceAll("Module", capitalize(moduleName))
  return {
    name: fileName.replaceAll("module", moduleName),
    content: fileContent
  }
})

files.forEach(({ name, content }) => {
  const filePath = path.join(basePath, name);

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content);
    console.log(`Created file: ${name}`);
  } else {``
    console.log(`File already exists: ${name}`);
  }
});

console.log(`\nModule "${modulePath}" created successfully!`);
