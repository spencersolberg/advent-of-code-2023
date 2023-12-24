export class Snapshot {
    bricks: Brick[];

    constructor(bricks: Brick[]) {
        this.bricks = bricks;
    }

    /**
     * Allows the bricks to fall down (gravity) and returns the number of bricks that changed position.
     * @returns The number of bricks that changed position.
     */
    public settle(): number {
        let changed = 0;

        const unsettledBricks = this.bricks.slice(0);
        unsettledBricks.sort(Brick.sorter);

        const settledBricks: Brick[] = [];

        while (unsettledBricks.length > 0) {
            const brick = unsettledBricks.shift()!;
            let settledBrick = new Brick({ ...brick.start }, { ...brick.end }, brick.id);
            // lower the brick by 1 until it collides with another brick
            while (!settledBrick.collidesWithAny(settledBricks) && settledBrick.start.z > 0) {
                settledBrick = settledBrick.toLowered(1);
            }

            if (!settledBrick.isSameAs(brick)) {
                changed++;
            }
        }

        this.bricks = settledBricks;

        return changed;
    }

    public disintegrate(id: string): Snapshot {
        return new Snapshot(this.bricks.filter(brick => brick.id !== id));
    }

    public toString(): string {
        return this.bricks.map(brick => brick.toString()).join("\n");
    }

    public getMaxX(): number {
        return this.bricks.reduce((max, brick) => Math.max(max, brick.end.x), 0);
    }

    public getMaxY(): number {
        return this.bricks.reduce((max, brick) => Math.max(max, brick.end.y), 0);
    }

    public getMaxZ(): number {
        return this.bricks.reduce((max, brick) => Math.max(max, brick.end.z), 0);
    }

    public displayBricksZX(): string {
        const maxX = this.getMaxX();
        const maxZ = this.getMaxZ();

        // Initialize the grid
        const grid = Array.from({ length: maxZ + 1 }, () => Array(maxX + 1).fill('.'));

        // Mark bricks on the grid
        this.bricks.forEach(brick => {
            for (let z = brick.start.z; z <= brick.end.z; z++) {
                for (let x = brick.start.x; x <= brick.end.x; x++) {
                    grid[z][x] = brick.id[0].toUpperCase(); // Using the first character of the id
                }
            }
        });

        // Generate output string
        let output = ' x\n';
        output += Array.from({ length: maxX + 1 }, (_, i) => i).join('') + '\n';

        for (let z = maxZ; z >= 0; z--) {
            output += grid[z].join('') + ' ' + z + '\n';
        }

        return output;
    }

    public displayBricksYZ(): string {
        const maxY = this.getMaxY();
        const maxZ = this.getMaxZ();

        // Initialize the grid
        const grid = Array.from({ length: maxZ + 1 }, () => Array(maxY + 1).fill('.'));

        // Mark bricks on the grid
        this.bricks.forEach(brick => {
            for (let z = brick.start.z; z <= brick.end.z; z++) {
                for (let y = brick.start.y; y <= brick.end.y; y++) {
                    grid[z][y] = brick.id[0].toUpperCase(); // Using the first character of the id
                }
            }
        });

        // Generate output string
        let output = ' y\n';
        output += Array.from({ length: maxY + 1 }, (_, i) => i).join('') + '\n';

        for (let z = maxZ; z >= 0; z--) {
            output += grid[z].join('') + ' ' + z + '\n';
        }

        return output;
    }
}

let lastId: string | undefined = undefined;

export class Brick {
    id: string;
    start: Coordinate;
    end: Coordinate;

    constructor(start: Coordinate, end: Coordinate, id?: string) {
        if (id !== undefined) {
            this.id = id;
        } else {
            // id should be a, then b, then c, once we hit z, we should start aa, ab, ac, etc.
            let newId: string;
    
            if (lastId === undefined) {
                newId = "a";
            } else {
                const lastIdArray = lastId.split("");
                const lastIdLastChar = lastIdArray.pop()!;
                if (lastIdLastChar === "z") {
                    lastIdArray.push("a");
                    newId = lastIdArray.join("") + "a";
                } else {
                    lastIdArray.push(String.fromCharCode(lastIdLastChar.charCodeAt(0) + 1));
                    newId = lastIdArray.join("");
                }
            }
    
            lastId = newId;
            this.id = newId;
        }
        this.start = start;
        this.end = end;
    }

    public getVolume(): number {
        const xLength = this.end.x - this.start.x + 1;
        const yLength = this.end.y - this.start.y + 1;
        const zLength = this.end.z - this.start.z + 1;

        return xLength * yLength * zLength;
    }

    public getHeight(): number {
        return this.end.z - this.start.z + 1;
    }

    public lower(distance: number): void {
        this.start.z -= distance;
        this.end.z -= distance;
    }

    public toLowered(distance: number): Brick {
        const brick = new Brick({ ...this.start }, { ...this.end }, this.id);
        brick.lower(distance);
        return brick;
    }

    public getCoordinates(): Coordinate[] {
        const coordinates: Coordinate[] = [];

        for (let x = this.start.x; x <= this.end.x; x++) {
            for (let y = this.start.y; y <= this.end.y; y++) {
                for (let z = this.start.z; z <= this.end.z; z++) {
                    coordinates.push({ x, y, z });
                }
            }
        }

        return coordinates;
    }

    static fromString(input: string): Brick {
        const [startString, endString] = input.split("~");
        const [startX, startY, startZ] = startString.split(",").map(Number);
        const [endX, endY, endZ] = endString.split(",").map(Number);

        return new Brick({ x: startX, y: startY, z: startZ }, { x: endX, y: endY, z: endZ });
    }

    static sorter(a: Brick, b: Brick): number {
        // Sort by lowest z, then lowest height, then lowest volume

        if (a.start.z < b.start.z) return -1;
        if (a.start.z > b.start.z) return 1;

        if (a.getHeight() < b.getHeight()) return -1;
        if (a.getHeight() > b.getHeight()) return 1;

        if (a.getVolume() < b.getVolume()) return -1;
        if (a.getVolume() > b.getVolume()) return 1;

        return -1;
    }

    public toString(): string {
        return `${this.start.x},${this.start.y},${this.start.z}~${this.end.x},${this.end.y},${this.end.z} <- ${this.id}`;
    }

    static stringifyCoordinate(coordinate: Coordinate): string {
        return `${coordinate.x},${coordinate.y},${coordinate.z}`;
    }

    static parseCoordinate(coordinate: string): Coordinate {
        const [x, y, z] = coordinate.split(",").map(Number);
        return { x, y, z };
    }

    public isSameAs(brick: Brick): boolean {
        return this.start.x === brick.start.x && this.start.y === brick.start.y && this.start.z === brick.start.z && this.end.x === brick.end.x && this.end.y === brick.end.y && this.end.z === brick.end.z;
    }

    public collidesWith(brick: Brick): boolean {
        const aCoordinates = this.getCoordinates().map(Brick.stringifyCoordinate);
        const bCoordinates = brick.getCoordinates().map(Brick.stringifyCoordinate);

        for (const coordinate of aCoordinates) {
            if (bCoordinates.includes(coordinate)) {
                return true;
            }
        }

        return false;
    }

    public collidesWithAny(bricks: Brick[]): boolean {
        for (const brick of bricks) {
            if (this.collidesWith(brick)) {
                return true;
            }
        }

        return false;
    }
}

type Coordinate = {
    x: number; // horizontal
    y: number; // horizontal
    z: number; // vertical
}