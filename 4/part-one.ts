class Scratchcard {
    winningNumbers: number[];
    numbers: number[];

    constructor(scratchcardString: string) {
        const cardRegex = /Card\s+[0-9]+:/g;
        const [winningNumbersString, numbersString] = scratchcardString.replace(
            cardRegex,
            "",
        ).split("|").map((string) => string.trim());

        const numberRegex = /([0-9]+)/g;
        const winningNumbers: number[] = [];
        const numbers: number[] = [];

        for (const match of [...winningNumbersString.matchAll(numberRegex)]) {
            winningNumbers.push(parseInt(match[0]));
        }

        for (const match of [...numbersString.matchAll(numberRegex)]) {
            numbers.push(parseInt(match[0]));
        }

        this.winningNumbers = winningNumbers;
        this.numbers = numbers;
    }

    get winners(): number[] {
        return this.numbers.filter((number) =>
            this.winningNumbers.includes(number)
        );
    }

    get value(): number {
        if (this.winners.length === 0) return 0;

        return 2 ** (this.winners.length - 1);
    }
}

const scratchcards = Deno.readTextFileSync("input.txt").split("\n").map(
    (line) => new Scratchcard(line),
);

const sum = scratchcards.reduce(
    (accumulator, scratchcard) => accumulator + scratchcard.value,
    0,
);
console.log(`Sum: ${sum}`);
