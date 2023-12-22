export class GardenMap {
    rows: Rows<Tile>;
    elf: Elf;
    private rowLength: number;
    private columnLength: number;

    constructor(input: string) {
        this.rows = input.split("\n").map(row => row.split("")) as Tile[][];

        const leftFoot = new Set<string>();
        leftFoot.add(GardenMap.stringifyPosition(GardenMap.startingPositionFromRows(this.rows)));

        const rightFoot = new Set<string>();

        const nextPositions = new Set<string>();
        for (let i = 0; i < 4; i++) {
            const newPosition = push(GardenMap.startingPositionFromRows(this.rows), i);
            const stringNewPosition = GardenMap.stringifyPosition(newPosition);
            nextPositions.add(stringNewPosition);
        }
        this.elf = { steps: 0, leftFoot, rightFoot, nextPositions };
        
        this.rowLength = this.rows.length;
        this.columnLength = this.rows[0].length;
    }

    static startingPositionFromRows(rows: Rows<Tile>): Position {
        const row = rows.findIndex(row => row.includes(Tile.StartingPosition));
        const column = rows[row].findIndex(tile => tile === Tile.StartingPosition);

        return { row, column };
    }

    public step(repetitions = 1, infiniteMap = false, logProgress = false, logEvery = 50): void {
        for (let i = 0; i < repetitions; i++) {
            if (logProgress && i % logEvery === 0) {
                console.log(`Step ${i}, Progress: ${(((i) / repetitions) * 100).toFixed(2)}%, Possible Positions: ${this.possiblePositions()}`);
            }
            this.elf.steps++;

            const nextPositions = new Set<string>();

            for (const positionString of this.elf.nextPositions) {
                const newPosition = GardenMap.parsePosition(positionString);

                let tile: Tile;
                if (this.isOutOfBounds(newPosition)) {
                    if (!infiniteMap) continue;
                    const fixedPosition = this.fixPosition(newPosition);
                    tile = this.rows[fixedPosition.row][fixedPosition.column];
                } else {
                    tile = this.rows[newPosition.row][newPosition.column];
                }

                if (tile === Tile.Rocks) continue;

                (this.elf.steps % 2 === 0 ? this.elf.leftFoot : this.elf.rightFoot).add(positionString);

                for (let i = 0; i < 4; i++) {
                    const nextPosition = push(newPosition, i);
                    const nextPositionString = GardenMap.stringifyPosition(nextPosition);

                    if (nextPositions.has(nextPositionString) || (this.elf.steps % 2 === 0 ? this.elf.rightFoot : this.elf.leftFoot).has(nextPositionString)) continue;

                    nextPositions.add(nextPositionString);
                }
            }

            this.elf.nextPositions = nextPositions;

        }
    }

    public isOutOfBounds(position: Position): boolean {
        return position.row < 0
            || position.row >= this.rowLength
            || position.column < 0
            || position.column >= this.columnLength;
    }

    public reset(): void {
        const leftFoot = new Set<string>();
        leftFoot.add(GardenMap.stringifyPosition(GardenMap.startingPositionFromRows(this.rows)));
        const rightFoot = new Set<string>();
        const nextPositions = new Set<string>();
        for (let i = 0; i < 4; i++) {
            const newPosition = push(GardenMap.startingPositionFromRows(this.rows), i);
            const stringNewPosition = GardenMap.stringifyPosition(newPosition);
            nextPositions.add(stringNewPosition);
        }
        this.elf = { steps: 0, leftFoot, rightFoot, nextPositions };
    }

    // public toString(displayElf = false): string {
    //     const rows: Rows<string> = [...this.rows];

    //     if (displayElf) {
    //         for (const stringPosition of this.elf.positions) {
    //             const position = GardenMap.parsePosition(stringPosition);
    //             rows[position.row][position.column] = "O";
    //         }
    //     }

    //     return rows.map(row => row.join("")).join("\n");
    // }

    public fixPosition(position: Position): Position {
        const fixedPosition: Position = {
            row: GardenMap.positiveModulus(position.row, this.rowLength),
            column: GardenMap.positiveModulus(position.column, this.columnLength)
        };

        return fixedPosition;
    }

    private static positiveModulus(dividend: number, divisor: number): number {
        return ((dividend % divisor) + divisor) % divisor;
    }

    static stringifyPosition(position: Position): string {
        return `${position.row},${position.column}`;
    }

    static parsePosition(stringPosition: string): Position {
        const [row, column] = stringPosition.split(",").map(Number);
        return { row, column };
    }

    public possiblePositions(): number {
        const even = this.elf.steps % 2 === 0;
        return (even ? this.elf.leftFoot : this.elf.rightFoot).size;
    }
}

enum Tile {
    StartingPosition = "S",
    GardenPlot = ".",
    Rocks = "#"
}

type Rows<T> = T[][];

type Position = {
    row: number,
    column: number
}

type Elf = {
    steps: number,
    leftFoot: Set<string>,
    rightFoot: Set<string>,
    nextPositions: Set<string>;
}

enum Direction {
    Up = 0,
    Right = 1,
    Down = 2,
    Left = 3
}

const push = (position: Position, direction: Direction): Position => {
    const [differenceRow, differenceColumn] =
        [[-1, 0], [0, 1], [1, 0], [0, -1]][direction];

    return {
        row: position.row + differenceRow,
        column: position.column + differenceColumn,
    };
};