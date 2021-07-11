export async function load() {
    await import('./core.js');
    await import('./users.js');
}

await load();
