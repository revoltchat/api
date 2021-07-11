# Revolt API

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
