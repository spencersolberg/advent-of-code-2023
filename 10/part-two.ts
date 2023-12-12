// deno-lint-ignore-file no-fallthrough
type Point = {
    x: number;
    y: number;
};

type Pipe = {
    symbol: string;
    position: Point;
};

enum Direction {
    North = 0,
    East = 1,
    South = 2,
    West = 3,
}

class PipeMap {
    lines: string[][];

    constructor(string: string) {
        this.lines = string.split("\n").map((line) => line.split(""));
    }

    get startingPosition(): Point {
        for (const [y, row] of this.lines.entries()) {
            for (const [x, cell] of row.entries()) {
                if (cell === "S") return { x, y };
            }
        }

        throw new Error("No starting position");
    }

    get loop(): Pipe[] {
        let origin: Direction | null = null;
        let currentPoint: Point = this.startingPosition;

        const loop: Pipe[] = [{ symbol: "S", position: currentPoint }];
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
                    nextSymbol = this.lines[nextPoint.y][nextPoint.x];
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
                    this.lines[currentPoint.y][currentPoint.x];

                if (
                    PipeMap.getAllowedSymbols(currentSymbol, direction)
                        .includes(nextSymbol)
                ) {
                    // console.log(`"${nextSymbol}" can be ${Direction[direction]} of "${currentSymbol}"!`)
                    // console.log("Breaking inner loop...\n")
                    origin = [2, 3, 0, 1][direction];
                    currentPoint = nextPoint;
                    loop.push({ symbol: nextSymbol, position: nextPoint });
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

        // loop[0] = { ...loop[0], symbol: PipeMap.deduceStartingPipe(loop[0], loop[1], loop[loop.length - 1]) };

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

    static getExpansion = (
        symbol: string,
        direction: Direction,
    ): string | null => {
        switch (symbol) {
            case "S":
                return null;
            case "|": {
                switch (direction) {
                    case Direction.North:
                        return "|";
                    case Direction.East:
                        return null;
                    case Direction.South:
                        return "|";
                    case Direction.West:
                        return null;
                }
            }
            case "-": {
                switch (direction) {
                    case Direction.North:
                        return null;
                    case Direction.East:
                        return "-";
                    case Direction.South:
                        return null;
                    case Direction.West:
                        return "-";
                }
            }
            case "L": {
                switch (direction) {
                    case Direction.North:
                        return "|";
                    case Direction.East:
                        return "-";
                    case Direction.South:
                        return null;
                    case Direction.West:
                        return null;
                }
            }
            case "J": {
                switch (direction) {
                    case Direction.North:
                        return "|";
                    case Direction.East:
                        return null;
                    case Direction.South:
                        return null;
                    case Direction.West:
                        return "-";
                }
            }
            case "7": {
                switch (direction) {
                    case Direction.North:
                        return null;
                    case Direction.East:
                        return null;
                    case Direction.South:
                        return "|";
                    case Direction.West:
                        return "-";
                }
            }
            case "F":
                switch (direction) {
                    case Direction.North:
                        return null;
                    case Direction.East:
                        return "-";
                    case Direction.South:
                        return "|";
                    case Direction.West:
                        return null;
                }
            default:
                throw new Error(`Current symbol invalid: ${symbol}`);
        }
    };

    static deduceStartingPipe = (starting: Pipe, first: Pipe, last: Pipe): string => {
        let firstDirection: Direction;
        if (first.position.y < starting.position.y) {
            firstDirection = Direction.North;
        } else if (first.position.x > starting.position.x) {
            firstDirection = Direction.East;
        } else {
            firstDirection = Direction.South;
        }

        let lastDirection: Direction;
        if (last.position.x > starting.position.x && firstDirection < Direction.East) {
            lastDirection = Direction.East;
        } else if (last.position.y > starting.position.y && firstDirection < Direction.South) {
            lastDirection = Direction.South;
        } else {
            lastDirection = Direction.West;
        }

        switch ([firstDirection, lastDirection]) {
            case [Direction.North, Direction.East]: return "L";
            case [Direction.North, Direction.South]: return "|";
            case [Direction.North, Direction.West]: return "J";
            case [Direction.East, Direction.South]: return "F";
            case [Direction.East, Direction.West]: return "-";
            case [Direction.South, Direction.West]: return "7";
            default:
                throw new Error(`Invalid combination: ${Direction[Direction.South]}, ${Direction[Direction.West]}`);
        }

    }
}
const pipeMap = new PipeMap(Deno.readTextFileSync("input.txt"));

const loopMap: string[][] = Array(pipeMap.lines.length).fill(null).map(
    () => Array(pipeMap.lines[0].length).fill(".")
);

for (const pipe of pipeMap.loop) {
    loopMap[pipe.position.y][pipe.position.x] = pipe.symbol;
}

// // const expanded = new Array(pipeMap.lines.length * 2).fill(new Array(pipeMap.lines[0].length * 2).fill("."));
// const expanded: string[][] = Array((pipeMap.lines.length * 2) - 3).fill(null).map(
//     () => Array(pipeMap.lines[0].length * 2).fill("."),
// );

// for (const pipe of pipeMap.loop) {
//     const y = pipe.position.y * 2;
//     const x = pipe.position.x * 2;
//     expanded[y][x] = pipe.symbol;

//     const directions = [
//         { direction: Direction.North, offset: { y: -1, x: 0 } },
//         { direction: Direction.East, offset: { y: 0, x: 1 } },
//         { direction: Direction.South, offset: { y: 1, x: 0 } },
//         { direction: Direction.West, offset: { y: 0, x: -1 } },
//     ];

//     for (const { direction, offset } of directions) {
//         const expansion = PipeMap.getExpansion(pipe.symbol, direction);
//         try {
//             expanded[y + offset.y][x + offset.x] = expansion || expanded[y + offset.y][x + offset.x];
//         } catch (_) {}
//     }

//     for (let row = 0; row < pipeMap.lines.length; row++) {
//         for (let col = 0; col < pipeMap.lines[0].length; col++) {
//             if (pipeMap.lines[row][col] === ".") {
//                 expanded[row * 2][col * 2] = "*";
//             }
//         }
//     }
// }

// // console.log(expanded);

let area = 0;

for (const [y, row] of loopMap.entries()) {
    let inside = false;
    let lastSymbol: string | null = null;
    for (const [x, char] of row.entries()) {
        switch (char) {
            case "|":
                inside = !inside;
                break;
            case "L": {
                lastSymbol = "L";
                break;
            }
            case "7": {
                if (lastSymbol === "L") inside = !inside;
                lastSymbol = null;
                break;
            }
            case "F": {
                lastSymbol = "F";
                break;
            }
            case "J": {
                if (lastSymbol === "F") inside = !inside;
                lastSymbol = null;
                break;
            }
            case ".":
                if (inside) {
                    area++;
                    loopMap[y][x] = "*"
                }
                break;
            default: break;
        }
    }
}
// console.log(loopMap.map((line) => line.join("")).join("\n"));
Deno.writeTextFileSync("output.txt", loopMap.map(line => line.join("")).join("\n"));

console.log(`Area: ${area}`);