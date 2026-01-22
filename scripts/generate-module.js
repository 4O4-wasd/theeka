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
const isSubModule = parts.length > 1;

const basePath = path.join(process.cwd(), "src", "modules", ...parts);

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

const serviceTemplate = /*ts */ `import { ${moduleName}Repository } from './${moduleName}.repository';

export const ${moduleName}Service =  {
  async findAll() {
    return await ${moduleName}Repository.findAll();
  }
}
`;

const routesTemplate = /*ts*/ `import { Hono } from 'hono';
import { ${moduleName}Service } from './${moduleName}.service';

export const ${moduleName}Routes = new Hono();
${moduleName}Routes.get('/', async (c) => {
  const ${moduleName} = await ${moduleName}Service.findAll();
  return c.json(${moduleName});
});
`;

const schemaTemplate = /*ts*/ `import { z } from 'zod';
import { HTTP_STATUS } from "@/status-codes";

const ${moduleName}Schema = {
  repository() {
    return {
      findAll: {}
    }
  },

  service() {
    return {
      findAll: this.repository().findAll
    }
  },

  route() {
    return {
      [HTTP_STATUS["OK"]]: this.service().findAll
    }
  }
}

export const ${moduleName}RepoSchema = ${moduleName}Schema.route();

`;

const repositoryTemplate = /*ts*/ `import db from '@/db';

export const ${moduleName}Repository = {
  async findAll() {
    return [];
  }
}
`;

/** @type {{name: `${string}.${string}.ts`, content: string}[]} */
const files = [
  { name: `${moduleName}.service.ts`, content: serviceTemplate },
  { name: `${moduleName}.repository.ts`, content: repositoryTemplate },
  { name: `${moduleName}.routes.ts`, content: routesTemplate },
  { name: `${moduleName}.schema.ts`, content: schemaTemplate },
];

files.forEach(({ name, content }) => {
  const filePath = path.join(basePath, name);

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content);
    console.log(`Created file: ${name}`);
  } else {
    console.log(`File already exists: ${name}`);
  }
});

console.log(`\nModule "${modulePath}" created successfully!`);

if (isSubModule) {
  console.log(
    `\nDon't forget to add the route to the parent module's routes file!`,
  );
} else {
  console.log(`\nDon't forget to add the route to main.ts:`);
  console.log(
    `   import { ${moduleName}Routes } from './modules/${modulePath}/${moduleName}.routes';`,
  );
  console.log(`   app.route('/${moduleName}', ${moduleName}Routes);`);
}
