import { GardenMap } from "./garden.ts";

const map = new GardenMap(await Deno.readTextFile("input.txt"));

map.step(5000, true, true);

console.log(`Possible Positions: ${map.possiblePositions()}`);