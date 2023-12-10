enum Direction {
    Left = 0,
    Right = 1,
}

type Node = {
    name: string;
    lookup: string[];
};

class MapDocument {
    pattern: Direction[];
    nodes: Node[];

    constructor(string: string) {
        const lines = string.split("\n");
        // rome-ignore lint/style/noNonNullAssertion: <explanation>
        const pattern = lines.shift()!.trim().split("").map((direction) =>
            direction === "R" ? Direction.Right : Direction.Left
        );

        const nodeRegex = /([A-Z]+) = \(([A-Z]+), ([A-Z]+)\)/g;
        const nodes = lines.slice(1).map((line) => {
            const matches = [...line.matchAll(nodeRegex)][0];

            return {
                name: matches[1],
                lookup: [matches[2], matches[3]],
            };
        });

        this.pattern = pattern;
        this.nodes = nodes;
    }
}

const map = new MapDocument(Deno.readTextFileSync("input.txt"));

let steps = 0;
// rome-ignore lint/style/noNonNullAssertion: <explanation>
let currentNode = map.nodes.find((node) => node.name === "AAA")!;

while (currentNode.name !== "ZZZ") {
    const direction = map.pattern[steps % map.pattern.length];
    steps++;
    // rome-ignore lint/style/noNonNullAssertion: <explanation>
    currentNode = map.nodes.find((node) =>
        node.name === currentNode.lookup[direction]
    )!;
}

console.log(`Steps: ${steps}`);
