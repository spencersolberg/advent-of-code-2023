/**
 * Turns any string of ASCII characters into a number using the Holiday ASCII String Helper algorithm.
 * 
 * @param string - The string to be hashed.
 * @returns The hashed number.
 */
export const hash = (string: string): number =>{
    let currentValue = 0;
    for (const char of string.split("")) {
        currentValue += char.charCodeAt(0);
        currentValue *= 17
        currentValue %= 256
    };

    return currentValue;
}

export class InitializationSequenceStrings {
    steps: string[];

    constructor(string: string) {
        this.steps = string.trim().split(",");
    }
}

export class InitializationSequence {
    steps: Step[];

    constructor(string: string) {
        this.steps = string.trim().split(",").map(step => new Step(step));
    }
}

class Step {
    label: string;
    operation: Operation;
    focalLength?: FocalLength;

    constructor(string: string) {
        const stepRegex = /([a-z]+)(=|-)([1-9])?/g;

        const [_, label, operationString, focalLengthString] = [...string.matchAll(stepRegex)][0];

        this.label = label;
        this.operation = operationString === "=" ? Operation.Equals : Operation.Dash;
        this.focalLength = focalLengthString ? parseInt(focalLengthString) as FocalLength : undefined;
    }
}

export class BoxSeries {
    boxes: Box[];

    constructor() {
        this.boxes = Array.from({ length: 256 }, () => new Box());
    }
}

class Box {
    slots: Lens[];

    constructor() {
        this.slots = [];
    }
}

export enum FocalLength {
    One = 1,
    Two = 2,
    Three = 3,
    Four = 4,
    Five = 5,
    Six = 6,
    Seven = 7,
    Eight = 8,
    Nine = 9
}

type Lens = {
    label: string;
    focalLength: FocalLength;
}

export enum Operation {
    Dash = 0,
    Equals = 1
}

// export const hashmap = ()