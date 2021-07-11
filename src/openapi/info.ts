import { OpenAPIV3 } from "openapi-types";
import { readFile } from "fs/promises";

export default async function(): Promise<OpenAPIV3.InfoObject> {
	return {
		"title": "Revolt API",
		"version": await readFile('package.json').then(v => JSON.parse(v.toString()).version),
		"description": `User-first privacy focused chat platform built with modern web technologies.

# Authentication

Currently all relevant requests are authenticated by the use of two headers which identify a session.

<SecurityDefinitions />`,
		"termsOfService": "https://revolt.chat/terms",
		"contact": {
			"name": "API Support",
			"email": "contact@revolt.chat",
			"url": "https://revolt.chat"
		},
		// Redoc logo
		["x-logo" as any]: {
			"url": "https://revolt.chat/header.png",
			"altText": "Revolt Header"
		},
	}
}
