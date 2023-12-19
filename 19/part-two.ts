import { System, Part } from "./lib/system.ts";

const system = new System(await Deno.readTextFile("input.txt"), false);

let combinations = 0;

for (let x = 1; x <= 4000; x++) {
    for (let m = 1; m <= 4000; m++) {
        for (let a = 1; a <= 4000; a++) {
            for (let s = 1; s <= 4000; s++) {
                if (system.considerPart({
                    extremelyCoolLooking: x,
                    musical: m,
                    aerodynamic: a,
                    shiny: s
                })) combinations++;
            }
        }
    }
}

console.log(`Total Combinations: ${combinations}`);