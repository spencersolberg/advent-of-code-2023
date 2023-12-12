const SCALE = 1_000_000;

class Image {
    rows: ImageCell[][];

    constructor(string: string) {
        this.rows = string.split("\n").map(line => line.split("").map(
            char => char === "." ? ImageCell.EmptySpace : ImageCell.Galaxy
        ));
    }

    public getExpansions = (): Expansions => {
        const expansions: Expansions = { rows: [], columns: [] };

        // add rows
        for (const [y, row] of this.rows.entries()) {
            if (row.every(cell => cell === ImageCell.EmptySpace)) expansions.rows.push(y);
        }

        // add columns
        for (let x = 0; x < this.rows[0].length; x++) {
            if (this.rows.every(row => row[x] === ImageCell.EmptySpace)) expansions.columns.push(x);
        }

        return expansions;
    }

    public toString = (): string => {
        return this.rows.map(row => row.map(
            cell => cell === ImageCell.EmptySpace ? "." : "#"
        ).join("")).join("\n");
    }

    public getGalaxies = (): Galaxy[] => {
        const galaxies: Galaxy[] = [];
        let i = 0;
        for (const [y, row] of this.rows.entries()) {
            for (const [x, cell] of row.entries()) {
                if (cell === ImageCell.Galaxy) {
                    galaxies.push({ row: y, column: x, id: i });
                    i++;
                }
            }
        }

        return galaxies;
    }

    static getStepsBetweenPoints(a: Galaxy, b: Galaxy, expansions?: Expansions): number {
        let distanceY = Math.abs(a.row - b.row);
        let distanceX = Math.abs(a.column - b.column);

        if (expansions) {
            for (const row of expansions.rows) {
                if (Math.min(a.row, b.row) < row && row < Math.max(a.row, b.row)) distanceY += (SCALE - 1);
            }

            for (const column of expansions.columns) {
                if (Math.min(a.column, b.column) < column && column < Math.max(a.column, b.column)) distanceX += (SCALE - 1);
            }
        }

        return distanceY + distanceX;
    }
}

enum ImageCell {
    EmptySpace = 0,
    Galaxy = 1
}

type Galaxy = {
    row: number;
    column: number;
    id: number;
}

type Expansions = {
    rows: number[];
    columns: number[];
}

const image = new Image(Deno.readTextFileSync("input.txt"));

const expansions = image.getExpansions();

const galaxies = image.getGalaxies();

let sum = 0;

for (const galaxyA of galaxies) {
    for (const galaxyB of galaxies.filter(galaxy => galaxy.id > galaxyA.id)) {
        sum += Image.getStepsBetweenPoints(galaxyA, galaxyB, expansions);
    }
}

console.log(`Sum: ${sum}`);