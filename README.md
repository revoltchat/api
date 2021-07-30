# Revolt API

![revolt-api](https://img.shields.io/npm/v/revolt-api)

This package contains typings for objects in the [Revolt API](https://developers.revolt.chat/api/) and code for generating the OpenAPI specification.

For most cases, if not all, you should only be concerned with `revolt-api/types`.

### Example Usage

```typescript
import type { User } from 'revolt-api/types/Users';
```

### Commit Style

If publishing a new version of the spec, the first line should always be the API version.

```
0.5.0-alpha.0
Commit description.
Line 2.
```

If you are creating new changes for a PR, don't include any version!

For any subsequent lines, prepend the relevant text:

 Prefix | Description
--------|-------------
`Structure` | Added a new data structure to the API.
`Route` | Added a new route to the API.
`Change` | Changed an existing route or data structure.
`Fix` | Fixes to structures / routes.
`Deprecation` | Use when deprecating a structure or route.
`Library` | Changes to this repo unrelated to the API.

Add new prefixes to this list as necessary.

### Tip

For faster compile times when working on API routes, comment out the categories you don't care about.

```ts
/// src/routes/index.ts
export async function load() {
    // await import('./core.js');
    // await import('./users.js');
    // await import('./channels.js');
    await import('./servers.js');
}

await load();
```
