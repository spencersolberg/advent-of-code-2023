class Image {
    rows: ImageCell[][];

    constructor(string: string) {
        this.rows = string.split("\n").map(line => line.split("").map(
            char => char === "." ? ImageCell.EmptySpace : ImageCell.Galaxy
        ));
    }

    public expand = () => {
        const newRows: ImageCell[][] = [];
        // add rows
        for (const row of this.rows) {
            newRows.push(row);
            if (row.every(cell => cell === ImageCell.EmptySpace)) {
                newRows.push(new Array(row.length).fill(ImageCell.EmptySpace));
            }
        }

        // add columns
        const indexes: number[] = [];

        for (let i = 0; i < this.rows[0].length; i++) {
            if (this.rows.every(row => row[i] === ImageCell.EmptySpace)) indexes.push(i);
        }

        for (const i of indexes.toReversed()) {
            for (const row of newRows) {
                row.splice(i + 1, 0, ImageCell.EmptySpace);
            }
        }

        this.rows = newRows;
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

    static getStepsBetweenPoints(a: Galaxy, b: Galaxy): number {
        const distanceY = Math.abs(a.row - b.row);
        const distanceX = Math.abs(a.column - b.column);

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

const image = new Image(Deno.readTextFileSync("input.txt"));

image.expand();

const galaxies = image.getGalaxies();

let sum = 0;

for (const galaxyA of galaxies) {
    for (const galaxyB of galaxies.filter(galaxy => galaxy.id > galaxyA.id)) {
        sum += Image.getStepsBetweenPoints(galaxyA, galaxyB);
    }
}

console.log(`Sum: ${sum}`);