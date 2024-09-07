# Revolt API

![revolt-api](https://img.shields.io/npm/v/revolt-api)

This package contains typings for objects in the [Revolt API](https://developers.revolt.chat/api/) and a fully typed API request builder using [openapi-fetch](https://openapi-ts.dev).

### Example Usage

If you just need access to types:

```typescript
import type { User } from "revolt-api";
```

If you want to send requests:

```typescript
import { createClient } from "./esm/index.js";

const api = createClient({
  // specify bot token:
  botToken: "bot-token",
  // .. or a user session token:
  sessionToken: "session-token",
  // .. also accepts options from openapi-fetch
  //    such as custom middleware, baseURL, etc
});

// Fetch information about user
api.GET("/users/@me").then((res) => console.info(res.data));

// Send a message to a channel
api.POST("/channels/{target}/messages", {
  params: {
    path: {
      target: "01F92C5ZXBQWQ8KY7J8KY917NM",
    },
  },
  body: {
    content: "Hello from Fetch/Node.js/Bun/Deno!",
  },
});
```
