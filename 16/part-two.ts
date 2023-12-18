import { Beam, Contraption, Direction } from "./lib/contraption.ts";

const string = await Deno.readTextFile("input.txt");
const reference = new Contraption(string);

const startingBeams: Beam[] = [];

for (const [row, _] of reference.rows.entries()) {
    // left entrances
    startingBeams.push({
        position: { row, column: -1 },
        facing: Direction.Right,
    });

    // right entrances
    startingBeams.push({
        position: { row, column: reference.rows[0].length },
        facing: Direction.Left,
    });
}

for (const [column, _] of reference.rows[0].entries()) {
    // up entrances
    startingBeams.push({
        position: { row: -1, column },
        facing: Direction.Down,
    });

    // down entrances
    startingBeams.push({
        position: { row: reference.rows.length, column },
        facing: Direction.Up,
    });
}

// console.log(startingBeams);

const results: Map<Beam, number> = new Map();

for (const [i, startingBeam] of startingBeams.entries()) {
    console.log(`Progress: ${((i / startingBeams.length) * 100).toFixed(2)}%`);
    const contraption = new Contraption(string, startingBeam);

    let lastTen: number[] = [];
    try {
        while (contraption.beams.size !== 0) {
            contraption.next();
            lastTen = [...lastTen.slice(-9), contraption.energized()];
    
            if (
                lastTen.length === 10 &&
                lastTen.every((energized) => energized === lastTen[0])
            ) {
                break;
            }
        }
    } catch (e) {
        console.error(`Error traveling ${Direction[startingBeam.facing]} from [${startingBeam.position.row}, ${startingBeam.position.column}]`);

        throw e;
    }

    console.log(`New Result: ${contraption.energized()}`);

    results.set(startingBeam, contraption.energized());
};

// Find the startingBeam and result with the highest energized amount
let maxEnergized = 0;
let maxStartingBeam: Beam | undefined;

for (const [startingBeam, energized] of results.entries()) {
    if (energized > maxEnergized) {
        maxEnergized = energized;
        maxStartingBeam = startingBeam;
    }
}

console.log("Starting Beam with Highest Energized Amount:", maxStartingBeam);
console.log("Highest Energized Amount:", maxEnergized);
