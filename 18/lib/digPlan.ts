import PriorityQueue from "https://esm.sh/ts-priority-queue@0.1.1";

export class DigPlan {
    instructions: DigInstruction[];

    constructor(input: string) {
        const instructionRegex = /(U|D|L|R) (\d+) \(#([0-9a-f]{6})\)/g;
        const instructions: DigInstruction[] = [];

        for (const line of input.split("\n")) {
            const matches = [ ...line.matchAll(instructionRegex)][0];

            let direction: Direction;
            switch (matches[1])  {
                case "U": {
                    direction = Direction.Up;
                    break;
                }
                case "R": {
                    direction = Direction.Right;
                    break;
                }
                case "D": {
                    direction = Direction.Down;
                    break;
                }
                case "L": {
                    direction = Direction.Left;
                    break;
                }
                default: {
                    throw new Error(`Unrecognized direction: ${matches[1]}`);
                }
            }

            instructions.push({ direction, meters: parseInt(matches[2]), color: matches[3] });
        }

        this.instructions = instructions;
    }
}

type DigInstruction = {
    direction: Direction;
    meters: number;
    color: string;
}

enum Direction {
    Up = 0,
    Right = 1,
    Down = 2,
    Left = 3
}

export class Lagoon {
    rows: Row<Tile>[];

    constructor(plan: DigPlan) {
        let perimeter: Position[] = [];

        let position: Position = { row: 0, column: 0 };

        for (const instruction of plan.instructions) {
            for (let i = 0; i < instruction.meters; i++) {
                perimeter.push(position);
                position = push(position, instruction.direction);
            }
        }

        const minRow = perimeter.reduce((min, pos) => pos.row < min ? pos.row : min, Number.POSITIVE_INFINITY);
        const maxRow = perimeter.reduce((max, pos) => pos.row > max ? pos.row : max, Number.NEGATIVE_INFINITY);
        const minColumn = perimeter.reduce((min, pos) => pos.column < min ? pos.column : min, Number.POSITIVE_INFINITY);
        const maxColumn = perimeter.reduce((max, pos) => pos.column > max ? pos.column : max, Number.NEGATIVE_INFINITY);

        perimeter = perimeter.map(pos => {
            return { row: pos.row - minRow, column: pos.column - minColumn } as Position;
        });

        const rows: Row<Tile>[] = [];

        for (let i = 0; i <= maxRow - minRow; i++) {
            const row: Tile[] = [];
            for (let j = 0; j <= maxColumn - minColumn; j++) {
                row.push(Tile.LevelTerrain);
            }

            rows.push(row);
        }

        for (const pos of perimeter) {
            rows[pos.row][pos.column] = Tile.Trench;
        }

        this.rows = rows;
    }

    private static stringFromTile(tile: Tile): string {
        return tile;
    }
    private static stringFromTiles(tiles: Tile[]): string {
        return tiles.map(tile => Lagoon.stringFromTile(tile)).join("");
    }
    private static stringFromRows(rows: Row<Tile>[]): string {
        return rows.map(row => Lagoon.stringFromTiles(row)).join("\n");
    }

    public toString(): string {
        return Lagoon.stringFromRows(this.rows);
    }

    public volume(): number {
        return this.rows.flat().filter(tile => tile === Tile.Trench).length;
    }

    public digInterior(): void {
        let interiorPosition: Position;
        try {
            interiorPosition = this.findInterior();
        } catch (e) {
            console.error(e);
            console.warn("This lagoon's interior may have already been dug");
            return;
        }

        // const queue: Position[] = [ interiorPosition ];
        const queue = new PriorityQueue<Position>({ comparator: (a, b) => a.row - b.row});

        queue.queue(interiorPosition);

        let lastRow = -1;

        while (queue.length !== 0) {
            // rome-ignore lint/style/noNonNullAssertion: <explanation>
            const currentPosition = queue.dequeue()!;

            if (currentPosition.row !== lastRow) {
                console.log(`Row: ${currentPosition.row}, ${((currentPosition.row / this.rows.length) * 100).toFixed(2)}%`);
                lastRow = currentPosition.row;
            }

            this.rows[currentPosition.row][currentPosition.column] = Tile.Trench;

            for (const direction of [0, 1, 2, 3] as Direction[]) {
                const nextPosition = push(currentPosition, direction);

                try {
                    if (this.rows[nextPosition.row][nextPosition.column] === Tile.LevelTerrain) queue.queue(nextPosition);
                } catch (_) {
                    //
                }
            }
        }
    }

    private findInterior(): Position {
        const midColumn = Math.floor(this.rows[0].length / 2);
        let interiorPosition: Position | null = null;

        for (let c = 0; c < this.rows[0].length; c++) {
            const column = midColumn + c < this.rows[0].length ? midColumn + c : midColumn + c - this.rows[0].length;
            for (let r = 0; r < this.rows.length; r++) {
                if (this.rows[r][column] === Tile.LevelTerrain) {
                    interiorPosition = { row: r, column };
                    break;
                }
            }

            if (interiorPosition) break;
        }

        if (!interiorPosition) throw new Error("No interior could be found");

        return interiorPosition;
    }
}

enum Tile {
    Trench = "#",
    LevelTerrain = "."
}

type Row<t> = t[];

type Position = {
    row: number;
    column: number;
}

export const push = (position: Position, direction: Direction): Position => {
    const [differenceRow, differenceColumn] =
        [[-1, 0], [0, 1], [1, 0], [0, -1]][direction];

    return {
        row: position.row + differenceRow,
        column: position.column + differenceColumn,
    };
};