# Revolt API

![revolt-api](https://img.shields.io/npm/v/revolt-api)

This package contains typings for objects in the [Revolt API](https://developers.revolt.chat/api/) and code for generating the OpenAPI specification.

For most cases, if not all, you should only be concerned with `revolt-api/types`.

### Example Usage

```typescript
import type { User } from 'revolt-api/types/Users';
```

### Tip (for development)

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
