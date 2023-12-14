import { Platform, Direction } from "./lib/platform.ts";

const platform = new Platform(Deno.readTextFileSync("input.txt"));

platform.tilt(Direction.North);

console.log(`Total Load: ${platform.getLoad()}`);