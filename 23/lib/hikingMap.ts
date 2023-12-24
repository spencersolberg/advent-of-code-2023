export class HikingMap {
    rows: Tile[][];

    constructor(input: string) {
        this.rows = input.split("\n").map(row => row.split("") as Tile[]);
    }

    get rowsCount(): number {
        return this.rows.length;
    }

    get columnsCount(): number {
        return this.rows[0].length;
    }

    public toString(): string {
        return this.rows.map(row => row.join("")).join("\n");
    }

    public getStartingPosition(): Position {
        return {
            row: 0,
            column: this.rows[0].indexOf(Tile.Path)
        }
    }

    public getEndingPosition(): Position {
        return {
            row: this.rows.length - 1,
            column: this.rows[this.rows.length - 1].indexOf(Tile.Path)
        }
    }

    public isOutOfBounds(position: Position): boolean {
        return position.row < 0
            || position.row >= this.rowsCount
            || position.column < 0
            || position.column >= this.columnsCount;
    
    }

    static stringifyPosition(position: Position): string {
        return `${position.row},${position.column}`;
    }

    static parsePosition(positionString: string): Position {
        const [row, column] = positionString.split(",").map(Number);
        return { row, column };
    }

    public getCrossroads(): Position[] {
        const crossroads: Position[] = [];

        for (const [r, row] of this.rows.entries()) {
            for (const [c, tile] of row.entries()) {
                if (tile === Tile.Forest) continue;

                let neighbors = 0;

                for (const direction of [0, 1, 2, 3]) {
                    const neighboringPosition = push({ row: r, column: c }, direction);
                    if (this.isOutOfBounds(neighboringPosition)) continue;

                    const neighboringTile = this.rows[neighboringPosition.row][neighboringPosition.column];
                    if (neighboringTile === Tile.Forest) continue;

                    neighbors++;
                }

                if (neighbors > 2) crossroads.push({ row: r, column: c });
            }
        }
        
        return crossroads;
    }
    
}

export enum Tile {
    Path = ".",
    Forest = "#",
    SlopeUp = "^",
    SlopeRight = ">",
    SlopeDown = "v",
    SlopeLeft = "<"
}

export type Position = {
    row: number,
    column: number
}

export enum Direction {
    Up = 0,
    Right = 1,
    Down = 2,
    Left = 3
}

export const push = (position: Position, direction: Direction): Position => {
    const [differenceRow, differenceColumn] =
        [[-1, 0], [0, 1], [1, 0], [0, -1]][direction];

    return {
        row: position.row + differenceRow,
        column: position.column + differenceColumn,
    };
};

export const arePositionsEqual = (a: Position, b: Position): boolean => {
    return a.row === b.row && a.column === b.column;
}

export class Hiker {
    map: HikingMap;
    
    constructor(map: HikingMap) {
        this.map = map;
    }

    public findLongestPathLength(drySlopes = false, log = false): number {
        const unfinishedPaths: Position[][] = [[this.map.getStartingPosition()]];
        // const finishedPaths: Position[][] = [];
        let longestPathLength = 0;

        while (unfinishedPaths.length > 0) {
            const currentPath = unfinishedPaths.shift()!;
            const currentPosition = currentPath.at(-1)!;

            if (arePositionsEqual(currentPosition, this.map.getEndingPosition())) {
                // finishedPaths.push(currentPath);
                if (currentPath.length - 1 > longestPathLength) {
                    longestPathLength = currentPath.length - 1;
                    if (log) console.log(`New longest path length: ${longestPathLength}, ${unfinishedPaths.length} unfinished paths remaining...`);
                }
                continue;
            }

            const nextPaths: Position[][] = [];

            let directions: Direction[];

            if (drySlopes) {
                directions = [0, 1, 2, 3];
            } else {
                const currentTile = this.map.rows[currentPosition.row][currentPosition.column];
                switch (currentTile) {
                    case Tile.Path: directions = [0, 1, 2, 3]; break;
                    case Tile.SlopeUp: directions = [0]; break;
                    case Tile.SlopeRight: directions = [1]; break;
                    case Tile.SlopeDown: directions = [2]; break;
                    case Tile.SlopeLeft: directions = [3]; break;
                    default: throw new Error(`Unexpected tile: ${currentTile}`);
                }
            }

            for (const direction of directions) {
                const nextPosition = push(currentPosition, direction);
                if (this.map.isOutOfBounds(nextPosition)) continue;

                if (currentPath.some(position => arePositionsEqual(position, nextPosition))) continue;

                const nextTile = this.map.rows[nextPosition.row][nextPosition.column];
                if (nextTile === Tile.Forest) continue;

                const nextPath = [...currentPath, nextPosition];
                nextPaths.push(nextPath);
            }

            unfinishedPaths.push(...nextPaths);
        }

        return longestPathLength;
    }
}