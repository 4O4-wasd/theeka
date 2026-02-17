import { existsSync, readdirSync } from 'fs';

function getFolders(dir) {
    if (!existsSync(dir)) return [];
    return readdirSync(dir, { withFileTypes: true })
        .filter(d => d.isDirectory())
        .map(d => d.name);
}

const apps = getFolders('apps');
const packages = getFolders('packages');
const libs = getFolders('libs');

const scopes = [...apps, ...packages, ...libs, 'deps', 'ci', 'root'];

export default {
    extends: ['@commitlint/config-conventional'],
    rules: {
        'scope-enum': [2, 'always', scopes]
    }
};