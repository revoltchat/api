import convert from '@openapi-contrib/json-schema-to-openapi-schema';
import { generator, type_files } from '../typescript.js';
import * as TJS from "typescript-json-schema";
import { readFileSync } from "fs";

const TYPE_RE = /(?:type|enum|interface) (\w+)/g
export default async function() {
    let types: string[] = [];
    for (const path of type_files) {
        const f = readFileSync(path).toString();
        types = types.concat([...f.matchAll(TYPE_RE)].map(x => x[1]));
    }

    let definitions: { [key: string]: TJS.Definition } = {};
    for (let type of types) {
        try {
            const defn = generator.getSchemaForSymbol(type);
            if (defn) {
                definitions[type] = await convert(defn);
            }
        } catch (err) {}
    }

    return definitions;
}
