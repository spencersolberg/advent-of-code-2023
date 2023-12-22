import { GardenMap } from "./garden.ts";

const map = new GardenMap(await Deno.readTextFile("input.txt"));

map.step(64);
console.log(`Possible Positions: ${map.possiblePositions()}`)