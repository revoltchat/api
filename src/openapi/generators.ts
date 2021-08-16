import { OpenAPIV3 } from "openapi-types";

export async function success(description: string, json?: Promise<OpenAPIV3.MediaTypeObject> | OpenAPIV3.MediaTypeObject | OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject): Promise<{ responses: OpenAPIV3.ResponsesObject }> {
    const response: OpenAPIV3.ResponseObject = {
        description
    };

    if (json) {
        response.content = {
            "application/json": {
                schema: await json
            }
        }
    }

    return { responses: { "200": response } };
}

export async function noContent(description: string): Promise<{ responses: OpenAPIV3.ResponsesObject }> {
    const response: OpenAPIV3.ResponseObject = {
        description
    };

    return { responses: { "204": response } };
}

export async function body(description: string, json: Promise<OpenAPIV3.MediaTypeObject> | OpenAPIV3.MediaTypeObject | OpenAPIV3.ReferenceObject): Promise<{ requestBody: OpenAPIV3.RequestBodyObject }> {
    return {
        requestBody: {
            description,
            content: {
                "application/json": {
                    "schema": await json
                }
            }
        }
    };
}

export async function parameter(name: string, description: string, json: Promise<OpenAPIV3.SchemaObject> | OpenAPIV3.SchemaObject | OpenAPIV3.ReferenceObject): Promise<OpenAPIV3.ParameterObject> {
    return {
        name,
        in: 'path',
        required: true,
        description,
        schema: await json
    }
}

export function ref(id: string) {
    return {
        $ref: `#/definitions/${id}`
    }
}
