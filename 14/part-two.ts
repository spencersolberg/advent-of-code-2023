import { Platform, Direction } from "./lib/platform.ts";

const platform = new Platform(Deno.readTextFileSync("input.txt"));

// platform.cycle(1_000_000_000);
platform.cycle(1_000);

// console.log(platform.toString());

console.log(`Total Load: ${platform.getLoad()}`);
