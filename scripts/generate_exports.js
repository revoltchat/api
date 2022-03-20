import { readFile, writeFile } from 'fs/promises';

const NOTICE = `// This file was auto-generated!\n`;

readFile('OpenAPI.json')
    .then(data => {
        const entries = ["import { components } from './schema';"];

        const spec = JSON.parse(data);
        const schemas = spec.components.schemas;

        for (const schema of Object.keys(schemas)) {
            entries.push(`export type ${schema} = components['schemas']['${schema}'];`);
        }

        writeFile('src/types.ts', NOTICE + entries.join('\n') + ";");
    });
