import { Contraption } from "./lib/contraption.ts";

const contraption = new Contraption(await Deno.readTextFile("input.txt"));
let lastTen: number[] = [];
while (contraption.beams.size !== 0) {
    contraption.next();
    // console.log(`Energized: ${contraption.energized()}`);
    lastTen = [...lastTen.slice(-9), contraption.energized()];

    if (
        lastTen.length === 10 &&
        lastTen.every((energized) => energized === lastTen[0])
    ) {
        break;
    }
}

console.log(`Total Energized: ${contraption.energized()}`);
