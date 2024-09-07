const { readFile, writeFile } = require("node:fs/promises");

const RE_SCHEMA = /\["schemas"\]\["([\w\d]+)"\]/g;

readFile("src/api.d.ts")
  .then((f) => f.toString())
  .then((src) => [...src.matchAll(RE_SCHEMA)].map(([_, m1]) => m1))
  .then((arr) => new Set(arr))
  .then((set) => [...set])
  .then((schemas) =>
    writeFile(
      "src/types.d.ts",
      `import type { components } from "./api";

${schemas.map((n) => `type ${n} = components["schemas"]["${n}"];`).join("\n")}

export type { ${schemas.join(", ")} };
`
    )
  );
