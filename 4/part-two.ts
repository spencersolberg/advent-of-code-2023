class Scratchcard {
    winningNumbers: number[];
    numbers: number[];
    id: number;

    constructor(scratchcardString: string) {
        const cardRegex = /Card\s+([0-9]+):/g;

        const id = parseInt([...scratchcardString.matchAll(cardRegex)][0][1]);

        const [winningNumbersString, numbersString] = scratchcardString.replace(cardRegex, "").split("|").map(string => string.trim());
        
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
        this.id = id;
    }

    get winners(): number[] {
        return this.numbers.filter(number => this.winningNumbers.includes(number));
    }

    get value(): number {
        if (this.winners.length === 0) return 0;

        return 2 ** (this.winners.length - 1);
    }

    get rewardIDs(): number[] {
        // // rome-ignore lint/style/noNonNullAssertion: <explanation>
        // if (rewardMap.has(this.id)) return rewardMap.get(this.id)!;
        const rewardIDs: number[] = [];
        for (let i = 1; i <= this.winners.length; i++) {
            rewardIDs.push(this.id + i);
        }

        // rewardMap.set(this.id, rewardIDs);

        return rewardIDs;
    }
}

// const starting = Deno.readTextFileSync("input.txt").split("\n").map(line => new Scratchcard(line));

// const unprocessed: Scratchcard[] = starting;
// const processed: Scratchcard[] = [];

// while (unprocessed.length !== 0) {
//     const scratchcard = unprocessed[0];
//     for (const id of scratchcard.rewardIDs) {
//         if (id > starting.length) break;
//         // rome-ignore lint/style/noNonNullAssertion: <explanation>
//         unprocessed.push(starting.find(card => card.id === id)!)
//     }
//     processed.push(scratchcard);
//     unprocessed.shift();
//     if (processed.length % 1000 === 0) console.log(`Processed: ${processed.length}, Unprocessed: ${unprocessed.length}`);
// }

// console.log(`Scratchcard Total: ${processed.length}`);

const scratchcards = Deno.readTextFileSync("input.txt").split("\n").map(line => new Scratchcard(line));
const counts: Map<number, number> = new Map();

for (const scratchcard of scratchcards) {
    counts.set(scratchcard.id, 1);
}

let total = 0;

for (const scratchcard of scratchcards) {
    // rome-ignore lint/style/noNonNullAssertion: <explanation>
    const count = counts.get(scratchcard.id)!
    total += count;

    for (const rewardID of scratchcard.rewardIDs) {
        if (counts.has(rewardID)) {
            // rome-ignore lint/style/noNonNullAssertion: <explanation>
            const  currentCount = counts.get(rewardID)!;
            counts.set(rewardID, currentCount + count)
        }
    }
}

console.log(`Total: ${total}`);