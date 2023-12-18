export class Contraption {
    rows: Tile[][];
    // beams: Beam[];
    beams: Set<Beam>;

    constructor(string: string, startingBeam?: Beam) {
        const rows: Tile[][] = [];
        const lines = string.split("\n");

        for (const line of lines) {
            const row: Tile[] = [];
            const chars = line.split("");

            for (const char of chars) {
                let type: TileType;

                switch (char) {
                    case ".": {
                        type = TileType.Empty;
                        break;
                    }
                    case "/": {
                        type = TileType.ForwardMirror;
                        break;
                    }
                    case "\\": {
                        type = TileType.BackMirror;
                        break;
                    }
                    case "-": {
                        type = TileType.HorizontalSplitter;
                        break;
                    }
                    case "|": {
                        type = TileType.VerticalSplitter;
                        break;
                    }
                    default: {
                        throw new Error(`Unrecognized character: ${char}`);
                    }
                }

                row.push({ type, energized: false });
            }

            rows.push(row);
        }

        const beams = new Set<Beam>();
        if (startingBeam) {
            beams.add(startingBeam);
        } else {
            beams.add({ position: { row: 0, column: -1 }, facing: Direction.Right });
        };
        this.rows = rows;
        this.beams = beams;
        // this.beams = startingBeam
        //     ? [startingBeam]
        //     : [{ position: { row: 0, column: -1 }, facing: Direction.Right }];
    }

    public toString(): string {
        return Contraption.stringFromLines(this.rows);
    }

    private static stringFromLines(lines: Tile[][]): string {
        return lines.map((line) => Contraption.stringFromLine(line)).join("\n");
    }

    private static stringFromLine(line: Tile[]): string {
        return line.map((tile) => {
            switch (tile.type) {
                case TileType.Empty:
                    return ".";
                case TileType.ForwardMirror:
                    return "/";
                case TileType.BackMirror:
                    return "\\";
                case TileType.HorizontalSplitter:
                    return "-";
                case TileType.VerticalSplitter:
                    return "|";
            }
        }).join("");
    }

    public next() {
        const newBeams: Beam[] = [];
        let expired = false;
        for (const beam of this.beams) {
            // Energize tiles currently under beams
            if (beam.position.column >= 0 && beam.position.column < this.rows[0].length && beam.position.row >= 0 && beam.position.row < this.rows.length) {
                const tile = this.rows[beam.position.row][beam.position.column];
                tile.energized = true;
            }

            // Push beam in facing direction
            beam.position = push(beam.position, beam.facing);

            // Expire beam if out of contraption bounds
            if (
                beam.position.row >= this.rows.length ||
                beam.position.row < 0 ||
                beam.position.column >= this.rows[0].length ||
                beam.position.column < 0
            ) {
                expired = true;
                continue;
            }

            // Reassess facing direction based on new tile
            const newTile = this.rows[beam.position.row][beam.position.column];

            switch (newTile.type) {
                case TileType.Empty:
                    break;
                case TileType.ForwardMirror: { // "/"
                    switch (beam.facing) {
                        case Direction.Up: {
                            beam.facing = Direction.Right;
                            break;
                        }
                        case Direction.Right: {
                            beam.facing = Direction.Up;
                            break;
                        }
                        case Direction.Down: {
                            beam.facing = Direction.Left;
                            break;
                        }
                        case Direction.Left: {
                            beam.facing = Direction.Down;
                            break;
                        }
                    }
                    break;
                }
                case TileType.BackMirror: { // "\"
                    switch (beam.facing) {
                        case Direction.Up: {
                            beam.facing = Direction.Left;
                            break;
                        }
                        case Direction.Right: {
                            beam.facing = Direction.Down;
                            break;
                        }
                        case Direction.Down: {
                            beam.facing = Direction.Right;
                            break;
                        }
                        case Direction.Left: {
                            beam.facing = Direction.Up;
                            break;
                        }
                    }
                    break;
                }
                case TileType.HorizontalSplitter: {
                    switch (beam.facing) {
                        case Direction.Up: {
                            beam.facing = Direction.Right;
                            newBeams.push({ ...beam, facing: Direction.Left });
                            break;
                        }
                        case Direction.Right:
                            break;
                        case Direction.Down: {
                            beam.facing = Direction.Right;
                            // if (!newBeams.find(newBeam => newBeam.position.row === beam.position.row && newBeam.position.column === beam.position.column && beam.facing === Direction.Left)) 
                            newBeams.push({ ...beam, facing: Direction.Left });
                            break;
                        }
                        case Direction.Left:
                            break;
                    }
                    break;
                }
                case TileType.VerticalSplitter: {
                    switch (beam.facing) {
                        case Direction.Up:
                            break;
                        case Direction.Right: {
                            beam.facing = Direction.Up;
                            newBeams.push({ ...beam, facing: Direction.Down });
                            break;
                        }
                        case Direction.Down:
                            break;
                        case Direction.Left: {
                            beam.facing = Direction.Up;
                            newBeams.push({ ...beam, facing: Direction.Down });
                            break;
                        }
                    }
                }
            }
        }

        if (expired) {
            // this.beams = this.beams.filter((beam) =>
            //     beam.position.row < this.rows.length &&
            //     beam.position.row >= 0 &&
            //     beam.position.column < this.rows[0].length &&
            //     beam.position.column >= 0
            // );
            for (const beam of this.beams) {
                if (
                    beam.position.row >= this.rows.length ||
                    beam.position.row < 0 ||
                    beam.position.column >= this.rows[0].length ||
                    beam.position.column < 0
                ) {
                    this.beams.delete(beam);
                }
            }
        }

        // remove duplicates of beams in newBeams
        

        for (const beam of newBeams) {
            this.beams.add(beam);
        }
    }

    public energized(): number {
        return this.rows.flat().filter((tile) => tile.energized).length;
    }

    public toEnergizedString(): string {
        return this.rows.map((row) =>
            row.map((tile) => tile.energized ? "#" : ".").join("")
        ).join("\n");
    }
}

export enum TileType {
    Empty = ".",
    ForwardMirror = "/",
    BackMirror = "\\",
    HorizontalSplitter = "-",
    VerticalSplitter = "|",
}

type Tile = {
    type: TileType;
    energized: boolean;
};

export enum Direction {
    Up = 0,
    Right = 1,
    Down = 2,
    Left = 3,
};

export type Beam = {
    position: Position;
    facing: Direction;
};

export type Position = {
    row: number;
    column: number;
};

export const push = (position: Position, direction: Direction): Position => {
    const [differenceRow, differenceColumn] =
        [[-1, 0], [0, 1], [1, 0], [0, -1]][direction];

    return {
        row: position.row + differenceRow,
        column: position.column + differenceColumn,
    };
};
