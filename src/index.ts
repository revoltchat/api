import { resolve } from "path";
import * as TJS from "typescript-json-schema";

const program = TJS.getProgramFromFiles(
    [
        resolve("types/January.ts"),
        resolve("types/Autumn.ts"),
        resolve("types/Users.ts"),
        resolve("types/Channels.ts")
    ],
    { }
);

const generator = TJS.buildGenerator(program, {
    required: true,
    // titles: true
});

import { inspect } from 'util';
console.log(inspect(generator?.getSchemaForSymbol("Message"), false, 10, true));
