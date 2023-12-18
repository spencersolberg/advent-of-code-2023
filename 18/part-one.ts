import { DigPlan, Lagoon } from "./lib/digPlan.ts";

const plan = new DigPlan(await Deno.readTextFile("input.txt"));

const lagoon = new Lagoon(plan);

lagoon.digInterior();

console.log(`Volume: ${lagoon.volume()}`);