import { System } from "./lib/system.ts";

const system = new System(await Deno.readTextFile("input.txt"));

const accepted = system.parts!.filter(part => system.considerPart(part));

const sum = accepted.reduce((sum, part) => sum += part.extremelyCoolLooking + part.musical + part.aerodynamic + part.shiny, 0);

console.log(`Sum: ${sum}`);