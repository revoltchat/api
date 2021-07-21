import { writeFile } from 'fs/promises';
import type { OpenAPIV3 } from "openapi-types";
import type * as TJS from "typescript-json-schema";

type Document = OpenAPIV3.Document & { definitions?: TJS.Definition };

import info from './openapi/info.js';
import definitions from './openapi/definitions.js';
import paths, { group, tags } from './openapi/paths.js';

import './routes/index.js';

async function generate(): Promise<Document> {
    return {
        ['__comment' as any]: "THIS FILE WAS AUTO-GENERATED USING https://gitlab.insrt.uk/revolt/api. DO NOT EDIT.",
        openapi: "3.0.0",
        info: await info(),
        tags,
        // Redoc tag groups
        ['x-tagGroups' as any]: group(),
        paths: await paths(),
        definitions: await definitions(),
        servers: [
            {
                "url": "https://api.revolt.chat",
                "description": "Production instance of the Revolt API"
            }
        ],
        components: {
            securitySchemes: {
                'User ID': {
                    type: "apiKey",
                    in: "header",
                    name: "x-user-id",
                    description: "User ID is found when calling `/auth/login`.\n"
                },
                'Session Token': {
                    type: "apiKey",
                    in: "header",
                    name: "x-session-token",
                    description: "Session is created by calling `/auth/login`.\n"
                },
                'Bot Token': {
                    type: "apiKey",
                    in: "header",
                    name: "x-bot-token",
                    description: "Bot tokens can be found by fetching `/bots/:id`.\n"
                }
            }
        }
    }
}

generate()
.then(v =>
    writeFile('OpenAPI.json', JSON.stringify(v, undefined, 2))
    );
    