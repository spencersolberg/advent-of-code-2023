class ConditionRecords {
    rows: ConditionRecordRow[];

    constructor(string: string) {
        const rows: ConditionRecordRow[] = [];

        for (const line of string.split("\n")) {
            rows.push(ConditionRecords.parseRow(line));
        }

        this.rows = rows;
    }

    private static parseRow(line: string, _quantities?: number[]): ConditionRecordRow {
        const [conditionsString, quantitiesString] = line.split(" ");
        const conditions = conditionsString.split("").map(char => {
            switch (char) {
                case ".": return Condition.Operational;
                case "#": return Condition.Damaged;
                case "?": return Condition.Unknown;
                default: throw new Error (`Unknown character: ${char}`);
            }
        });

        const quantities = _quantities ?? quantitiesString.split(",").map(char => parseInt(char));

        return new ConditionRecordRow(conditions, quantities);
    }

    static testRow(conditionsString: string, quantities: number[]): boolean {
        // console.log(`Testing row: ${conditionsString}`)
        const row = ConditionRecords.parseRow(conditionsString, quantities);
        const rowQuantities = row.groups().filter(group => group.condition === Condition.Damaged).map(group => group.quantity);
        // console.log({ row, groups: row.groups(), rq: rowQuantities });
        // console.log(row.toString(), row.conditions, rowQuantities);

        // const isValid = [...rowQuantities.entries()].every(([i, quantity]) => quantity === quantities[i])
        let isValid: boolean;
        try {
            isValid = [...quantities.entries()].every(([i, quantity]) => quantity === rowQuantities[i]) && quantities.length === rowQuantities.length;
        } catch (_) {
            isValid = false;
        }
        return isValid;
    }
}

class ConditionRecordRow  {
    conditions: Condition[];
    quantities: number[];

    constructor(conditions: Condition[], quantities: number[]) {
        this.conditions = conditions;
        this.quantities = quantities;
    }

    public operational(): number[] {
        return this.conditions.map(
            (condition, i) => condition === Condition.Operational ? i : -1
        ).filter(i => i >= 0);
    }

    public damaged(): number[] {
        return this.conditions.map(
            (condition, i) => condition === Condition.Damaged ? i : -1
        ).filter(i => i >= 0);
    }

    public unknown(): number[] {
        return this.conditions.map(
            (condition, i) => condition === Condition.Unknown ? i : -1
        ).filter(i => i >= 0);
    }

    public groups(): ConditionGroup[] {
        const groups: ConditionGroup[] = [];
        let lastCondition: Condition | null = null;
        let count = 0;
        for (const condition of this.conditions) {
            if (lastCondition === null) {
                lastCondition = condition;
                count = 1;
            } else if (lastCondition === condition) {
                count++;
            } else {
                groups.push({ condition: lastCondition, quantity: count });
                lastCondition = condition;
                count = 1;
            }
        };
        if (lastCondition === null) throw new Error("No conditions in row");
        groups.push({ condition: lastCondition, quantity: count})

        return groups;
    }

    public getPermutations(): string[] {
        const totalDamaged = this.quantities.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        // const damagedUnknowns = totalDamaged - this.damaged().length;
        // console.log({totalDamaged, damagedUnknowns});
        const permutations = ConditionRecordRow.generatePermutations(this.unknown().length);
        const strings = [];

        for (const permutation of permutations) {
            const conditions = [...this.conditions];
            for (const [i, condition] of permutation.entries()) {
                // console.log(condition);
                conditions[this.unknown()[i]] = condition;
            }

            const string = ConditionRecordRow.getStringFromConditions(conditions);
            // console.log(string);
            strings.push(string);
        }

        return strings;
    }

    private static generatePermutations(length: number): Condition[][] {
        if (length === 0) {
            return [[]];
        }

        const previousPermutations = ConditionRecordRow.generatePermutations(length - 1);
        const permutations = [];

        for (let i = 0; i < previousPermutations.length; i++ ) {
            const current = previousPermutations[i];

            permutations.push([ ...current, Condition.Damaged ]);
            permutations.push([ ...current, Condition.Operational ]);
        }

        return permutations;
    }

    public toString(): string {
        return this.conditions.map(condition => {
            switch (condition) {
                case Condition.Operational: return ".";
                case Condition.Damaged: return "#";
                case Condition.Unknown: return "?";
            }
        }).join("");
    }

    static getStringFromConditions(conditions: Condition[]): string {
        return conditions.map(condition => {
            switch (condition) {
                case Condition.Operational: return ".";
                case Condition.Damaged: return "#";
                case Condition.Unknown: return "?";
            }
        }).join("");
    }
}

enum Condition {
    Operational = 0,
    Damaged = 1,
    Unknown = 2
}

type ConditionGroup = {
    condition: Condition;
    quantity: number;
}

const records = new ConditionRecords(Deno.readTextFileSync("input.txt"));

let sum = 0;

for (const [i, row] of records.rows.entries()) {
    console.log(`Progress: ${((i / records.rows.length) * 100).toFixed(2)}%`)
    const permutations = row.getPermutations().filter(permutation => ConditionRecords.testRow(permutation, row.quantities));

    sum += permutations.length;

    // console.log({ row: row.toString(), permutations });
    
}

console.log(`Sum: ${sum}`);

// console.log(ConditionRecords.testRow(".###........", [3, 2, 1]))