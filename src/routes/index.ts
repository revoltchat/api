export async function load() {
    await import('./core.js');
    await import('./auth.js');
    await import('./users.js');
    await import('./channels.js');
    await import('./servers.js');
    await import('./bots.js');
    await import('./misc.js');
}

await load();
