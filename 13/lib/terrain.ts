export class Terrain {
    grid: Tile[][];

    constructor(string: string) {
        const grid = [];

        const lines = string.split("\n");
        for (const line of lines) {
            const row = [];

            for (const char of line.split("")) {
                const tile = char === "." ? Tile.Ash : Tile.Rock;

                row.push(tile);
            };

            grid.push(row);
        }

        this.grid = grid;
    }

    private static stringFromRow(row: Tile[]): string {
        return row.map(tile => tile === Tile.Ash ? "." : "#").join("");
    }

    public toString(): string {
        return this.grid.map(row => Terrain.stringFromRow(row)).join("\n");
    }

    private static stringFromGrid(grid: Tile[][]): string {
        return grid.map(row => Terrain.stringFromRow(row)).join("\n");
    }

    static compareGrids(a: Tile[][], b: Tile[][]): boolean {
        // console.log({ a, b })
        if (a.length !== b.length || a.length === 0) return false;
        let same = true;

        for (const [y, row] of a.entries()) {
            for (const [x, tile] of row.entries()) {
                if (tile !== b[y][x]) {
                    same = false;
                    break;
                }
            }
        }

        return same;
    }

    public getReflection(): Reflection | null {
        // Horizontal Axis
        for (const [i, _row] of this.grid.entries()) {
            const before = this.grid.slice(0, i + 1).toReversed();
            const after = this.grid.slice(i + 1);

            const min = Math.min(before.length, after.length);

            if (Terrain.compareGrids(before.slice(0, min), after.slice(0, min))) {
                return { axis: ReflectionAxis.Horizontal, start: i }
            }
        }

        // Vertical Axis
        const rotated = this.toRotated();

        for (const [i, _row] of rotated.entries()) {
            const before = rotated.slice(0, i + 1).toReversed();
            const after = rotated.slice(i + 1);

            const min = Math.min(before.length, after.length);

            if (Terrain.compareGrids(before.slice(0, min), after.slice(0, min))) {
                return { axis: ReflectionAxis.Vertical, start: i }
            }
        }

        return null;
    }

    private toRotated(): Tile[][] {
        const grid: Tile[][] = [];
        for (let i = 0; i < this.grid[0].length; i++) {
            const column = [];
            for (const row of this.grid) {
                column.push(row[i]);
            }
            grid.push(column);
        };

        return grid;
    }
}

enum Tile {
    Ash = 0,
    Rock = 1
}

export type Reflection = {
    axis: ReflectionAxis;
    start: number;
}

export enum ReflectionAxis {
    Horizontal = 0,
    Vertical = 1
}
