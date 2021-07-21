import { OpenAPIV3 } from "openapi-types";

export var tags: OpenAPIV3.TagObject[] = [];
var groups: { name: string, tags: string[] }[] = [];
var resources: OpenAPIV3.PathsObject<{}> = {};
var currentTag: string | undefined;
var accumulatedTags: string[] = [];
var currentGroup: string | undefined;

export function group(name?: string) {
    if (accumulatedTags.length > 0) {
        if (currentGroup) {
            groups.push({
                name: currentGroup,
                tags: accumulatedTags
            });
        }

        accumulatedTags = [];
    }

    if (name) {
        currentGroup = name;
    } else {
        return groups;
    }
}

export function tag(name: string, description: string) {
    accumulatedTags.push(name);
    currentTag = name;
    tags.push({
        name,
        description
    });
}

export function resource(path: string, methods: OpenAPIV3.PathItemObject) {
    console.info(`Generating resource ${path}.`);
    if (resources[path]) throw `Resource ${path} already exists!`;
    resources[path] = methods;
}

export function route(summary: string, description: string, obj: Omit<OpenAPIV3.OperationObject, 'summary' | 'tags'>): OpenAPIV3.OperationObject {
    return {
        summary,
        description,
        tags: currentTag ? [ currentTag ] : [ ],
        ...obj
    }
}

export function routeAuthenticated(summary: string, description: string, obj: Omit<OpenAPIV3.OperationObject, 'summary' | 'tags'>): OpenAPIV3.OperationObject {
    return {
        ...route(summary, description, obj),
        security: [
            {
                'User ID': [],
                'Session Token': []
            },
            {
                'Bot Token': []
            }
        ]
    }
}

export default async function(): Promise<OpenAPIV3.PathsObject<{}>> {
    return resources;
}
