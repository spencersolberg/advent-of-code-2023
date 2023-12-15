import { InitializationSequenceStrings, hash } from "./lib/hash.ts";

const sequence = new InitializationSequenceStrings(await Deno.readTextFile("input.txt"));

const sum = sequence.steps.map(step => hash(step)).reduce((accumulator, currentValue) => accumulator + currentValue, 0);

console.log(`Sum: ${sum}`);