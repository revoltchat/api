import { resolve } from "path";
import * as TJS from "typescript-json-schema";
import { readdirSync, writeFileSync } from "fs";
import convert from '@openapi-contrib/json-schema-to-openapi-schema';

export const type_files = readdirSync('types')
    .filter(x => x !== '__temp')
    .map(x => resolve('types', x));

export function createProgram(files = type_files) {
    return TJS.getProgramFromFiles(files);
}

const settings = {
    required: true
};

export const generator = TJS.buildGenerator(createProgram(), settings)!;

export async function schema(str: TemplateStringsArray, name: string) {
    console.info(`Processing schema ${name}.`);
    let fn = resolve('types', '__temp.ts')
    writeFileSync(fn, str.join(name));

    const program = createProgram([ fn ]);
    const schema = TJS.generateSchema(program, name, settings, [])!;
    return await convert(schema);
}
