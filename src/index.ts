import { resolve } from "path";
import * as TJS from "typescript-json-schema";
import { readdirSync, readFileSync, writeFileSync } from "fs";
import convert from '@openapi-contrib/json-schema-to-openapi-schema';

const files = readdirSync('types')
    .map(x => resolve('types', x));

const program = TJS.getProgramFromFiles(
    files,
    { }
);

const generator = TJS.buildGenerator(program, {
    required: true,
    // titles: true
});

const TYPE_RE = /(?:type|enum|interface) (\w+)/g

let types: string[] = [];
for (const path of files) {
    const f = readFileSync(path).toString();
    types = types.concat([...f.matchAll(TYPE_RE)].map(x => x[1]));
}

const pkg = require('../package.json');
import { OpenAPIV3 } from 'openapi-types';

(async () => {
let definitions: { [key: string]: TJS.Definition } = {};
for (let type of types) {
    const defn = generator?.getSchemaForSymbol(type);
    if (defn) {
        definitions[type] = await convert(defn);
    }
}

// import { inspect } from 'util';
// console.log(inspect(definitions, false, 10, true));

const OpenAPI: (OpenAPIV3.Document & { definitions: typeof definitions }) = {
    openapi: "3.0.0",
    info: {
        title: "Revolt API",
        version: pkg.version
    },
    paths: {
        "/": {
            get: {
                summary: "test",
                responses: {
                    "200": {
                        "description": "bro",
                        content: {
                            "application/json": {
                                schema: {
                                    $ref: "#/definitions/Channel"
                                }
                            }
                        }
                    }
                }
            }
        }
    },
    definitions
};

writeFileSync('OpenAPI.json', JSON.stringify(OpenAPI, undefined, 2));
})();