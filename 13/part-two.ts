import { ReflectionAxis, Terrain } from "./lib/terrain.ts";

const terrains = Deno.readTextFileSync("input.txt").split("\n\n").map(string => new Terrain(string));

let summary = 0;

for (const [i, terrain] of terrains.entries()) {
    const reflection = terrain.getSmudgeReflection();
    if (!reflection) continue;
    console.log({...reflection, i});

    if (!reflection) continue
    switch (reflection.axis) {
        case ReflectionAxis.Vertical: {
            summary += reflection.start + 1;
            break;
        }
        case ReflectionAxis.Horizontal: {
            summary += 100 * (reflection.start + 1);
            break;
        }
    }
}

console.log(`Summary: ${summary}`);