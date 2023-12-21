export class ModuleConfiguration {
    modules: Module[];

    constructor(input: string) {
        const moduleRegex = /(%|&)([a-z]+) -> ([a-z, ]+)/g;
        const broadcasterRegex = /broadcaster -> ([a-z, ]+)/g;

        const modules: Module[] = [];
        let outputModule = false;

        for (const line of input.split("\n")) {
            if (line.startsWith("broadcaster")) {
                const destinations = [...line.matchAll(broadcasterRegex)][0][1].split(", ");
                modules.push({
                    type: "broadcast",
                    name: "broadcaster",
                    destinations
                });
            } else {
                const [symbol, name, destinationString] = [...line.matchAll(moduleRegex)][0].slice(1);
                const destinations = destinationString.split(", ");
                if (destinations.includes("output")) outputModule = true;
                switch (symbol) {
                    case "%": {
                        modules.push({
                            type: "flip-flop",
                            name,
                            on: false,
                            destinations
                        });
                        break;
                    }
                    case "&": {
                        modules.push({
                            type: "conjunction",
                            name,
                            memory: {},
                            destinations
                        });
                        break;
                    }
                }

            }
        }

        for (const conjunction of modules.filter(m => m.type === "conjunction") as ConjunctionModule[]) {
            for (const input of modules.filter(m => m.destinations.includes(conjunction.name))) {
                conjunction.memory[input.name] = PulseStrength.Low;
            }
        }

        if (outputModule) modules.push({
            type: "output",
            name: "output",
            destinations: []
        });

        this.modules = modules;
    }

    public pushButton(): Result {
        let lowPulses = 0;
        let highPulses = 0;
        
        let rxLowPulsed = false;

        const queue: Pulse[] = [];
        queue.push({ name: "broadcaster", strength: PulseStrength.Low, origin: null });
        while (queue.length !== 0) {
            const { name, strength, origin } = queue.shift()!;
            if (name === "rx" && strength === PulseStrength.Low) rxLowPulsed = true;
            const module = this.modules.find(m => m.name === name) ?? { type: "output", name, destinations: [] };
            if (!module) {
                console.log({ name, strength, origin });
            }
            switch (strength) {
                case PulseStrength.Low: lowPulses++; break;
                case PulseStrength.High: highPulses++; break;
            }

            switch (module.type) {
                case "broadcast": {
                    for (const destination of module.destinations) {
                        queue.push({ name: destination, strength, origin: name });
                    }
                    continue;
                }
                case "flip-flop": {
                    if (strength === PulseStrength.High) {
                        continue;
                    }

                    module.on = !module.on;

                    for (const destination of module.destinations) {
                        queue.push({ name: destination, strength: module.on ? PulseStrength.High : PulseStrength.Low, origin: name });
                    }
                    continue;
                }
                case "conjunction": {
                    if (!origin) throw new Error("Conjunction reached with no origin");
                    module.memory[origin] = strength;

                    const allHighPulses = Object.values(module.memory).every(strength => strength === PulseStrength.High);

                    for (const destination of module.destinations) {
                        queue.push({ name: destination, strength: allHighPulses ? PulseStrength.Low : PulseStrength.High, origin: name });
                    }
                    continue;
                }
                case "output": {
                    continue
                }
            }
        }

        const initialState = (this.modules.filter(m => m.type === "flip-flop") as FlipFlopModule[]).every(m => m.on === false);

        return { highPulses, lowPulses, initialState, rxLowPulsed };
    }
}

type Module = FlipFlopModule | ConjunctionModule | BroadcastModule | OutputModule;

type FlipFlopModule = {
    type: "flip-flop";
    name: string;
    on: boolean;
    destinations: string[];
}

type ConjunctionModule = {
    type: "conjunction";
    name: string;
    memory: Record<string, PulseStrength>;
    destinations: string[];
}

type BroadcastModule = {
    type: "broadcast";
    name: string;
    destinations: string[];
}

type OutputModule = {
    type: "output";
    name: string;
    destinations: string[];
}

enum PulseStrength {
    Low = 0,
    High = 1
}

type Result = {
    lowPulses: number;
    highPulses: number;
    initialState: boolean;
    rxLowPulsed: boolean;
}

type Pulse = {
    name: string;
    strength: PulseStrength;
    origin: string | null;
}