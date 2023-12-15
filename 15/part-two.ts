import { BoxSeries, InitializationSequence, Operation, hash } from "./lib/hash.ts";

const series = new BoxSeries();

const sequence = new InitializationSequence(await Deno.readTextFile("input.txt"));

for (const step of sequence.steps) {
    const relevantBox = series.boxes[hash(step.label)];
    switch(step.operation) {
        case Operation.Dash: {
            relevantBox.slots = relevantBox.slots.filter(lens => lens.label !== step.label);
            break;
        }
        case Operation.Equals: {
            if (!step.focalLength) throw new Error("Equals operation should have focal length");
            const index = relevantBox.slots.findIndex(lens => lens.label === step.label);

            if (index === -1) {
                relevantBox.slots.push({ label: step.label, focalLength: step.focalLength });
            } else {
                relevantBox.slots[index].focalLength = step.focalLength;
            }
        }
    }
}

let sum = 0;
for (const [i, box] of series.boxes.entries()) {
    for (const [j, lens] of box.slots.entries()) {
        sum += (i + 1) * (j + 1) * lens.focalLength;
    }
}

console.log(`Sum: ${sum}`);