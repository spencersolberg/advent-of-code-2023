import { ModuleConfiguration } from "./lib/configuration.ts";

const configuration = new ModuleConfiguration(await Deno.readTextFile("input.txt"));

const repetitions = 1_000;
let cycle = Number.POSITIVE_INFINITY;
let lowPulsesPerCycle = 0;
let highPulsesPerCycle = 0;

let surpassed = false;

console.log(`Finding cycle...`);

for (let i = 1; i < Number.POSITIVE_INFINITY; i++) {
    const { lowPulses, highPulses, initialState } = configuration.pushButton();
    lowPulsesPerCycle += lowPulses;
    highPulsesPerCycle += highPulses;

    if (i === repetitions) {
        surpassed = true;
        console.log(`No cycle found, already hit ${repetitions} button presses`);
        const product = lowPulsesPerCycle * highPulsesPerCycle;
        console.log(`Product: ${product}`);
        break;
    }
    if (initialState) {
        cycle = i;
        break;
    }
}

if (!surpassed) {
    console.log(`Found cycle: ${cycle} button press(es)`);
    
    console.log(`Calculating cycles (${Math.floor(repetitions / cycle)} cycles)...`)
    let lowPulses = Math.floor(repetitions / cycle) * lowPulsesPerCycle;
    let highPulses = Math.floor(repetitions / cycle) * highPulsesPerCycle;
    
    console.log(`Processing remainders (${repetitions % cycle} button pushes)...`);
    for (let i = 1; i <= repetitions % cycle; i++) {
        const result = configuration.pushButton();
        lowPulses += result.lowPulses;
        highPulses += result.highPulses;
    }
    
    const product = lowPulses * highPulses;
    
    console.log(`Product: ${product}`);
}
