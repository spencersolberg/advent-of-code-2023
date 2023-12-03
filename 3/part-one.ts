type PartNumber = {
    value: number,
    row: number,
    index: number
}

type Space = {
    row: number,
    index: number
}

const schematic = Deno.readTextFileSync("input.txt");
const rows = schematic.split("\n");

const partNumbers: PartNumber[] = [];

for (const [i, row] of rows.entries()) {
    // console.log(row);
    const regex = /[0-9]{1,3}/g;

    const matches = [...row.matchAll(regex)];
    
    partNumbers.push(...matches.map(match => ({
        value: parseInt(match[0]),
        row: i,
        // rome-ignore lint/style/noNonNullAssertion: <explanation>
        index: match.index!
    })));
}

// console.log(partNumbers);

const isValid = (partNumber: PartNumber): boolean => {
    const adjacentSpaces = getAdjacentSpaces(partNumber);
    return hasSymbol(adjacentSpaces);
}

const getAdjacentSpaces = (partNumber: PartNumber): Space[] => {
    const columnCount = rows[0].length;
    const rowCount = rows.length;

    const valueLength = new String(partNumber.value).length;

    const adjacentSpaces: Space[] = [];
    for (let i = 0; i < valueLength; i++) {
        const topLeft = {
            y: partNumber.row - 1,
            x: partNumber.index + i - 1
        }
        const topMiddle = {
            y: partNumber.row - 1,
            x: partNumber.index + i
        }
        const topRight = {
            y: partNumber.row -1,
            x: partNumber.index + i + 1
        }

        const left = {
            y: partNumber.row,
            x: partNumber.index + i - 1
        }
        const right = {
            y: partNumber.row,
            x: partNumber.index + i + 1
        }
        
        const bottomLeft = {
            y: partNumber.row + 1,
            x: partNumber.index + i - 1
        }
        const bottomMiddle = {
            y: partNumber.row + 1,
            x: partNumber.index + i
        }
        const bottomRight = {
            y: partNumber.row + 1,
            x: partNumber.index + i + 1
        }

        if (topLeft.y >= 0 && topLeft.x >= 0) {
            adjacentSpaces.push({ row: topLeft.y, index: topLeft.x });
        }
        if (topMiddle.y >= 0) {
            adjacentSpaces.push({ row: topMiddle.y, index: topMiddle.x });
        }
        if (topRight.y >= 0 && topRight.x < columnCount) {
            adjacentSpaces.push({ row: topRight.y, index: topRight.x });
        }

        if (left.x >= 0) {
            adjacentSpaces.push({ row: left.y, index: left.x });
        }
        if (right.x < columnCount) {
            adjacentSpaces.push({ row: right.y, index: right.x });
        }

        if (bottomLeft.y < rowCount && bottomLeft.x >= 0) {
            adjacentSpaces.push({ row: bottomLeft.y, index: bottomLeft.x });
        }
        if (bottomMiddle.y < rowCount) {
            adjacentSpaces.push({ row: bottomMiddle.y, index: bottomMiddle.x });
        }
        if (bottomRight.y < rowCount && bottomRight.x < columnCount) {
            adjacentSpaces.push({ row: bottomRight.y, index: bottomRight.x });
        }
    }

    return adjacentSpaces;
}

const hasSymbol = (spaces: Space[]): boolean => {
    const regex = /[^0-9\.]/g;
    for (const space of spaces) {
        const character = rows[space.row].split("")[space.index];
        if(character.match(regex)) return true
    }

    return false;
}

const validPartNumbers = partNumbers.filter(isValid);

const sum = validPartNumbers.reduce((accumulator, partNumber) => accumulator + partNumber.value, 0);

console.log(`Sum: ${sum}`);

// console.log(validPartNumbers);