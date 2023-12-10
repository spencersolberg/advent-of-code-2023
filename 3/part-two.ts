type Point = {
    x: number;
    y: number;
};

class PartNumber {
    points: Point[];
    value: number;

    constructor(value: number, x: number, y: number) {
        this.value = value;
        const valueLength = new String(value).length;
        const points: Point[] = [];
        points.push({
            x,
            y,
        });
        if (valueLength > 1) {
            points.push({
                x: x + 1,
                y,
            });
        }
        if (valueLength > 2) {
            points.push({
                x: x + 2,
                y,
            });
        }

        this.points = points;
    }
}

const isAdjacent = (partNumber: PartNumber, gear: Point): boolean => {
    for (const point of partNumber.points) {
        const diffX = Math.abs(gear.x - point.x);
        const diffY = Math.abs(gear.y - point.y);

        if (diffX <= 1 && diffY <= 1) return true;
    }
    return false;
};

const schematic = Deno.readTextFileSync("input.txt").split("\n");

const gears: Point[] = [];
const partNumbers: PartNumber[] = [];

for (const [i, row] of schematic.entries()) {
    const partNumberRegex = /[0-9]{1,3}/g;
    const partNumberMatches = [...row.matchAll(partNumberRegex)].map(
        (match) => ({
            value: parseInt(match[0]),
            // rome-ignore lint/style/noNonNullAssertion: <explanation>
            index: match.index!,
        }),
    );
    for (const match of partNumberMatches) {
        partNumbers.push(new PartNumber(match.value, match.index, i));
    }

    const gearRegex = /\*/g;
    // rome-ignore lint/style/noNonNullAssertion: <explanation>
    const gearMatches = [...row.matchAll(gearRegex)].map((match) =>
        match.index!
    );

    for (const match of gearMatches) {
        gears.push({
            x: match,
            y: i,
        });
    }
}

let sum = 0;

for (const gear of gears) {
    const adjacentPartNumbers = partNumbers.filter((partNumber) =>
        isAdjacent(partNumber, gear)
    );

    if (adjacentPartNumbers.length === 2) {
        sum += adjacentPartNumbers[0].value * adjacentPartNumbers[1].value;
    }
}

console.log(`Sum: ${sum}`);
