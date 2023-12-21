import { ModuleConfiguration } from "./lib/configuration.ts";

const configuration = new ModuleConfiguration(await Deno.readTextFile("input.txt"));

for (let i = 1; i < Number.POSITIVE_INFINITY; i++) {
    const { rxLowPulsed } = configuration.pushButton();
    if (rxLowPulsed) {
        console.log(`Presses: ${i}`);
        break;
    }
}