export class Platform {
    rows: Tile[][];

    constructor(string: string) {
        const rows = [];
        
        const lines = string.split("\n");
        for (const line of lines) {
            const row = [];
            for (const char of line.split("")) {
                let tile: Tile;

                switch (char) {
                    case "O": {
                        tile = Tile.RoundedRock;
                        break;
                    }
                    case "#": {
                        tile = Tile.CubeRock;
                        break;
                    }
                    case ".": {
                        tile = Tile.Empty;
                        break;
                    }
                    default: {
                        throw new Error(`Unrecognized tile character: ${char}`);
                    }
                }

                row.push(tile);
            }

            rows.push(row);
        }

        this.rows = rows;
    }

    public toString(): string {
        return this.rows.map(row => Platform.stringFromRow(row)).join("\n");
    }

    private static stringFromTile(tile: Tile): string {
        let string: string;

        switch (tile) {
            case Tile.RoundedRock: {
                string = "O";
                break;
            }
            case Tile.CubeRock: {
                string = "#";
                break;
            }
            case Tile.Empty:
                string = ".";
                break;
        }

        return string;
    }

    private static stringFromRow(row: Tile[]): string {
        return row.map(tile => Platform.stringFromTile(tile)).join("");
    }

    public getLoad(): number {
        let load = 0;
        // gets load on north support beam
        for (const [i, row] of this.rows.entries()) {
            const amount = this.rows.length - i;

            for (const tile of row) {
                if (tile === Tile.RoundedRock) load += amount;
            }
        }

        return load;
    }

    public tilt(direction: Direction): void {
        if (direction % 2 === 0) { // North/South
            const columns = Platform.transposeGrid(this.rows);

            for (const [i, column] of columns.entries()) {
                const groups = Platform.groupsFromTiles(column);
                const spaces = Platform.spacesFromGroups(groups);
                
                for (const space of spaces) {
                    space.sort((a, b) => a.tile === Tile.RoundedRock ? direction - 1 : [2, 3, 0, 1][direction] - 1)
                }

                columns[i] = Platform.tilesFromGroups(Platform.groupsFromSpaces(spaces));
            }

            this.rows = Platform.transposeGrid(columns);
        } else { // East/West
            for (const [i, row] of this.rows.entries()) {
                const groups = Platform.groupsFromTiles(row);
                const spaces = Platform.spacesFromGroups(groups);

                for (const space of spaces) {
                    space.sort((a, b) => -1 * (a.tile === Tile.RoundedRock ? direction - 2 : [2, 3, 0, 1][direction] - 2))
                }

                this.rows[i] = Platform.tilesFromGroups(Platform.groupsFromSpaces(spaces));
            }
        }
    }

    public cycle(repetitions = 1): void {
        let previous: Tile[][] | null = null;
        for (let i = 0; i < repetitions; i++) {
            // if (i % 100_000 === 0) console.log(`Cycle ${(i / repetitions * 100).toFixed(2)}% complete`);
            this.tilt(Direction.North);
            this.tilt(Direction.West);
            this.tilt(Direction.South);
            this.tilt(Direction.East);

            if (previous !== null && Platform.compareGrids(this.rows, previous)) {
                console.log("Found cycle");
                break;
            }

            previous = this.rows;
        }
    }

    public static transposeGrid(grid: Tile[][]): Tile[][] {
        const transposed: Tile[][] = [];
        for (let i = 0; i < grid[0].length; i++) {
            const lines = [];

            for (const line of grid) lines.push(line[i]);

            transposed.push(lines);
        }

        return transposed;
    }

    private static groupsFromTiles(tiles: Tile[]): Group[] {
        const groups: Group[] = [];

        let lastTile: Tile | null = null;
        let count = 0;

        for (const tile of tiles) {
            if (lastTile === null) {
                lastTile = tile;
                count = 1;
            } else if (lastTile === tile) {
                count++;
            } else {
                groups.push({ tile: lastTile, quantity: count });
                lastTile = tile;
                count = 1;
            }
        };

        if (lastTile === null) throw new Error("No tiles in array");
        groups.push({ tile: lastTile, quantity: count });

        return groups;
    }

    private static tilesFromGroups(groups: Group[]): Tile[] {
        const tiles: Tile[] = [];

        for (const group of groups) {
            for (let i = 0; i < group.quantity; i++) {
                tiles.push(group.tile);
            }
        }

        return tiles;
    }

    private static spacesFromGroups(groups: Group[]): Group[][] {
        const spaces: Group[][] = [];

        for (const group of groups) {
            if (group.tile === Tile.CubeRock) {
                spaces.push([group]);
            } else {
                if (spaces.length === 0) {
                    spaces.push([group]);
                } else if (spaces[spaces.length - 1][0].tile === Tile.CubeRock) {
                    spaces.push([group]);
                } else {
                    spaces[spaces.length - 1] = [...spaces[spaces.length - 1], group];
                }
            }
        }

        return spaces;
    }

    private static groupsFromSpaces(spaces: Group[][]): Group[] {
        const groups: Group[] = [];

        for (const space of spaces) {
            groups.push(...space);
        }

        return groups;
    }

    public static compareGrids(a: Tile[][], b: Tile[][]): boolean {
        if (a.length !== b.length) return false;

        for (const [y, row] of a.entries()) {
            if (row.length !== b[y].length) return false;

            for (const [x, tile] of row.entries()) {
                if (tile !== b[y][x]) return false;
            }
        }

        return true;
    }
}

enum Tile {
    RoundedRock = 0,
    CubeRock = 1,
    Empty = 2
}

export enum Direction {
    North = 0,
    East = 1,
    South = 2,
    West = 3
}

type Group = {
    tile: Tile;
    quantity: number;
}