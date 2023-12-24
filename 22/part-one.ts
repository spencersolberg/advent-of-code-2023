import { Snapshot, Brick } from "./lib/snapshot.ts";

const input = await Deno.readTextFile("input.txt");
const bricks = input.split("\n").map(Brick.fromString);
const snapshot = new Snapshot(bricks);

console.log(snapshot.displayBricksZX());

// snapshot.settle();

// console.log(snapshot.toString());

// let safe = 0;

// for (const brick of snapshot.bricks) {
//     const disintegrated = snapshot.disintegrate(brick.id);
//     const modified = disintegrated.settle();
//     if (modified === 0) safe++;
// }

// console.log(`Safe: ${safe}`);