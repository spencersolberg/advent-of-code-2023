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
    // nodes: Node[];
    nodesMap: Map<string, Node>;

    constructor(string: string) {
        const lines = string.split("\n");
        // rome-ignore lint/style/noNonNullAssertion: <explanation>
        const pattern = lines.shift()!.trim().split("").map((direction) =>
            direction === "R" ? Direction.Right : Direction.Left
        );

        const nodeRegex = /([A-Z0-9]+) = \(([A-Z0-9]+), ([A-Z0-9]+)\)/g;
        const nodes = lines.slice(1).map((line) => {
            const matches = [...line.matchAll(nodeRegex)][0];

            return {
                name: matches[1],
                lookup: [matches[2], matches[3]],
            };
        });

        const nodesMap = new Map();

        nodes.forEach((node) => nodesMap.set(node.name, node));

        this.pattern = pattern;
        // this.nodes = nodes;
        this.nodesMap = nodesMap;
    }
}

const mapDocument = new MapDocument(Deno.readTextFileSync("input.txt"));

// let steps = 0;

// const currentNodes: Node[] = map.nodes.filter(node => node.name.endsWith("A"));
const currentNodes: Node[] = Array.from(mapDocument.nodesMap.values()).filter(
    (node) => node.name.endsWith("A"),
);

// while (!currentNodes.every(node => node.name.endsWith("Z"))) {
//     const direction = mapDocument.pattern[steps % mapDocument.pattern.length];
//     steps++;
//     if (steps % 1_000_000 === 0) console.log(`Step: ${steps}`);

//     currentNodes.forEach((currentNode, i) => {
//         const nextNodeName = currentNode.lookup[direction];
//         // rome-ignore lint/style/noNonNullAssertion: <explanation>
//         const  nextNode = mapDocument.nodesMap.get(nextNodeName)!;
//         currentNodes[i] = nextNode;
//     })
// }

const steps = currentNodes.map((_) => 0);

for (let [i, currentNode] of currentNodes.entries()) {
    while (!currentNode.name.endsWith("Z")) {
        const direction =
            mapDocument.pattern[steps[i] % mapDocument.pattern.length];
        steps[i]++;

        const nextNodeName = currentNode.lookup[direction];
        // rome-ignore lint/style/noNonNullAssertion: <explanation>
        currentNode = mapDocument.nodesMap.get(nextNodeName)!;
    }
}

console.log(`Total Steps: ${steps}`);

const lowestCommonMultiple = (a: number, b: number) => {
    const gcd = (a: number, b: number): number => {
        if (b === 0) return a;
        return gcd(b, a % b);
    };

    return (a * b) / gcd(a, b);
};

const totalSteps = steps.reduce(lowestCommonMultiple);

console.log(totalSteps);
