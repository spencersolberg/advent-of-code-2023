import { City, Path, push, Direction } from "./lib/city.ts";

import PriorityQueue from "https://esm.sh/ts-priority-queue@0.1.1";

const city = new City(await Deno.readTextFile("input.txt"));

const seen: Path[] = [];
const queue = new PriorityQueue<Path>({ comparator: (a, b) => a.heatLoss - b.heatLoss });

queue.queue({ position: { row: 0, column: 0 }, direction: Direction.Up, directionStreak: 1, heatLoss: 0 });

let step = 0;

while (queue.length !== 0) {
    const path = queue.dequeue();

    if (city.isFinished(path.position)) {
        console.log(path.heatLoss);
        break;
    }

    if (seen.find(p => {
        return p.position.row === path.position.row && p.position.column === path.position.column && p.direction === path.direction && p.directionStreak === path.directionStreak;
    })) {
        continue;
    }

    seen.push(path);
    step++;
    if (step % 1000 === 0) {
        console.log(`Step: ${step}, Queue: ${queue.length}, Heat Loss: ${path.heatLoss}, Position: ${path.position.row}, ${path.position.column}, Direction: ${path.direction}, Direction Streak: ${path.directionStreak}`);
    }

    if (path.directionStreak < 3) {
        const nextPosition = push(path.position, path.direction);
        if (!city.isOutOfBounds(nextPosition)) {
            queue.queue({ position: nextPosition, direction: path.direction, directionStreak: path.directionStreak + 1, heatLoss: path.heatLoss + city.rows[nextPosition.row][nextPosition.column].heatLoss})
        }
    }

    for (const direction of [Direction.Up, Direction.Right, Direction.Down, Direction.Left]) {
        if (path.direction === direction || Math.abs(path.direction - direction) === 2) { // if we're going straight (already handled) or backwards (not allowed)
            continue;
        }

        const nextPosition = push(path.position, direction);
        if (!city.isOutOfBounds(nextPosition)) {
            queue.queue({ position: nextPosition, direction: direction, directionStreak: 1, heatLoss: path.heatLoss + city.rows[nextPosition.row][nextPosition.column].heatLoss})
        }
    }
}