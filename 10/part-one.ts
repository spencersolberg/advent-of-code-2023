// deno-lint-ignore-file no-fallthrough
type Point = {
    x: number;
    y: number;
};

enum Direction {
    North,
    East,
    South,
    West,
}

class PipeMap {
    pipes: string[][];

    constructor(string: string) {
        this.pipes = string.split("\n").map((line) => line.split(""));
    }

    get startingPosition(): Point {
        for (const [y, row] of this.pipes.entries()) {
            for (const [x, cell] of row.entries()) {
                if (cell === "S") return { x, y };
            }
        }

        throw new Error("No starting position");
    }

    get loop(): string[] {
        let origin: Direction | null = null;
        let currentPoint: Point = this.startingPosition;

        const loop = ["S"];
        let continuing = true;

        while (true) {
            for (
                const [direction, [transformX, transformY]] of [
                    [0, -1],
                    [1, 0],
                    [0, 1],
                    [-1, 0],
                ].entries()
            ) {
                continuing = true;
                if (direction === origin) {
                    // console.log(`Skipping ${Direction[direction]} for (${currentPoint.x}, ${currentPoint.y})...\n`);
                    if (direction === 3) {
                        // console.log(`Breaking loop as all directions exhausted...`);
                        continuing = false;
                        break;
                    }
                    continue;
                }

                const nextPoint: Point = {
                    x: currentPoint.x + transformX,
                    y: currentPoint.y + transformY,
                };
                // console.log(`${Direction[direction]} for (${currentPoint.x}, ${currentPoint.y}) is (${nextPoint.x}, ${nextPoint.y})`);
                let nextSymbol;
                try {
                    nextSymbol = this.pipes[nextPoint.y][nextPoint.x];
                } catch (_) {
                    continue;
                }

                if (nextSymbol === "S") {
                    // console.log("Next symbol is \"S\", skipping...\n");
                    continue;
                } else {
                    // console.log(`Next symbol is "${nextSymbol}"`);
                }

                const currentSymbol =
                    this.pipes[currentPoint.y][currentPoint.x];

                if (
                    PipeMap.getAllowedSymbols(currentSymbol, direction)
                        .includes(nextSymbol)
                ) {
                    // console.log(`"${nextSymbol}" can be ${Direction[direction]} of "${currentSymbol}"!`)
                    // console.log("Breaking inner loop...\n")
                    origin = [2, 3, 0, 1][direction];
                    currentPoint = nextPoint;
                    loop.push(nextSymbol);
                    break;
                }

                // console.log(`"${nextSymbol}" cannot be ${Direction[direction]} of "${currentSymbol}"!`);
                if (direction === 3) {
                    // console.log(`Breaking loop as all directions exhausted...\n`);
                    continuing = false;
                    break;
                }
                // console.log("Continuing inner loop...\n");
            }

            // console.log(`Loop so far: ${loop}\n`);
            if (!continuing) break;
        }

        // console.log(`Complete: ${loop}`);

        return loop;
    }

    static getAllowedSymbols = (
        currentSymbol: string,
        direction: Direction,
    ): string[] => {
        switch (currentSymbol) {
            case "S":
                switch (direction) {
                    case Direction.North:
                        return ["|", "7", "F"];
                    case Direction.East:
                        return ["-", "J", "7"];
                    case Direction.South:
                        return ["|", "L", "J"];
                    case Direction.West:
                        return ["-", "L", "F"];
                }
            case "|":
                switch (direction) {
                    case Direction.North:
                        return ["S", "|", "7", "F"];
                    case Direction.East:
                        return [];
                    case Direction.South:
                        return ["S", "|", "L", "J"];
                    case Direction.West:
                        return [];
                }
            case "-":
                switch (direction) {
                    case Direction.North:
                        return [];
                    case Direction.East:
                        return ["S", "-", "J", "7"];
                    case Direction.South:
                        return [];
                    case Direction.West:
                        return ["S", "-", "L", "F"];
                }
            case "L":
                switch (direction) {
                    case Direction.North:
                        return ["S", "|", "F", "7"];
                    case Direction.East:
                        return ["S", "-", "J", "7"];
                    case Direction.South:
                        return [];
                    case Direction.West:
                        return [];
                }
            case "J":
                switch (direction) {
                    case Direction.North:
                        return ["S", "|", "F", "7"];
                    case Direction.East:
                        return [];
                    case Direction.South:
                        return [];
                    case Direction.West:
                        return ["S", "-", "L", "F"];
                }
            case "7":
                switch (direction) {
                    case Direction.North:
                        return [];
                    case Direction.East:
                        return [];
                    case Direction.South:
                        return ["S", "|", "L", "J"];
                    case Direction.West:
                        return ["S", "-", "L", "F"];
                }
            case "F":
                switch (direction) {
                    case Direction.North:
                        return [];
                    case Direction.East:
                        return ["S", "-", "J", "7"];
                    case Direction.South:
                        return ["S", "|", "L", "J"];
                    case Direction.West:
                        return [];
                }
            default:
                throw new Error(`Current symbol invalid: ${currentSymbol}`);
        }
    };
}
const pipeMap = new PipeMap(Deno.readTextFileSync("input.txt"));

const midpoint = pipeMap.loop.length / 2;

console.log(`Midpoint: ${midpoint}`);
