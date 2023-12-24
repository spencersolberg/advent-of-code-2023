import { HikingMap, Hiker } from "./lib/hikingMap.ts";

const input = await Deno.readTextFile("input.txt");

const map = new HikingMap(input);

const hiker = new Hiker(map);

const longestPathLength = hiker.findLongestPathLength(true, true);

console.log(`Longest Path Length: ${longestPathLength}`);