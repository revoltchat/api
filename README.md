# Revolt API

### Commit Style

If publishing a new version of the spec, the first line should always be the API version.

```
0.5.0-alpha.0
Commit description.
Line 2.
```

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
// src/routes/index.ts
export async function load() {
    // await import('./core.js');
    // await import('./users.js');
    // await import('./channels.js');
    await import('./servers.js');
}

await load();
```
