export class City {
    rows: Row<Block>[];

    constructor(input: string) {
        const rows: Row<Block>[] = [];

        for (const [r, line] of input.split("\n").entries()) {
            const row: Row<Block> = [];
            for (const [c, char] of line.split("").entries()) {
                row.push({ heatLoss: parseInt(char), position: { row: r, column: c }})
            }

            rows.push(row);
        }
        this.rows = rows;
    }

    public blocks(): Block[] {
        return this.rows.flat();
    }

    public isOutOfBounds({ row, column }: Position): boolean {
        return (row < 0 || row >= this.rows.length || column < 0 || column >= this.rows[0].length);
    }
    
    public isFinished({ row, column }: Position): boolean {
        return (row === this.rows.length - 1 && column === this.rows[0].length - 1);
    }
}

type Row<t> = t[];

export type Block = {
    heatLoss: HeatLoss;
    position: Position;
}

export enum HeatLoss {
    One = 1,
    Two = 2,
    Three = 3,
    Four = 4,
    Five = 5,
    Six = 6,
    Seven = 7,
    Eight = 8,
    Nine = 9
}

export enum Direction {
    Up = 0,
    Right = 1,
    Down = 2,
    Left = 3
}

export type Position = {
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

const determineDirection = (origin: Position, destination: Position): Direction => {
    const [differenceRow, differenceColumn] =
        [destination.row - origin.row, destination.column - origin.column];

    if (differenceRow === -1 && differenceColumn === 0) return Direction.Up;
    if (differenceRow === 0 && differenceColumn === 1) return Direction.Right;
    if (differenceRow === 1 && differenceColumn === 0) return Direction.Down;
    if (differenceRow === 0 && differenceColumn === -1) return Direction.Left;

    throw new Error(`Unable to determine direction from ${JSON.stringify(origin)} to ${JSON.stringify(destination)}`);
}

// export class Path {
//     steps: Block[];

//     constructor(steps: Block[]) {
//         this.steps = steps;
//     }

//     public heatLoss(): number {
//         return this.steps.reduce((loss, block) => loss + block.heatLoss, 0);
//     }

//     public getPossibleDirections(): Direction[] {}
// }

export type Path = {
    heatLoss: number;
    position: Position;
    direction: Direction;
    directionStreak: number;
}