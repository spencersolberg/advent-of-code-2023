class Report {
    values: Value[];

    constructor(string: string) {
        const lines = string.split("\n");

        this.values = lines.map((line) => {
            const history = line.split(" ").map((num) => parseInt(num));
            return {
                history,
                prediction: Report.getPrediction(history),
            };
        });
    }

    static getPrediction = (history: number[]): number => {
        const sequences = [history];

        while (!sequences[sequences.length - 1].every((num) => num === 0)) {
            const lastSequence = sequences[sequences.length - 1];
            const newSequence = [];

            for (let i = 0; i <= lastSequence.length - 2; i++) {
                newSequence.push(lastSequence[i + 1] - lastSequence[i]);
            }

            sequences.push(newSequence);
        }

        sequences.reverse();

        for (const [i, sequence] of sequences.entries()) {
            if (i === 0) {
                sequence.unshift(0);
            } else {
                sequence.unshift(sequence[0] - sequences[i - 1][0]);
            }
        }

        return sequences[sequences.length - 1][0];
    };
}

type Value = {
    history: number[];
    prediction: number;
};

const report = new Report(Deno.readTextFileSync("input.txt"));

const sum = report.values.reduce(
    (accumulator, currentValue) => accumulator + currentValue.prediction,
    0,
);

console.log(`Sum: ${sum}`);
