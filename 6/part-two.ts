class Race {
    time: number;
    record: number;

    constructor(time: number, record: number) {
        this.time = time;
        this.record = record;
    }

    // public getWinners = (): number[] => {
    get winners() {
        const winners: number[] = [];

        for (let i = 1; i < this.time; i++) {
            const distance = (this.time - i) * i;
            if (distance > this.record) winners.push(i);
        }

        return winners;
    }
}

class Sheet {
    races: Race[];

    constructor(string: string) {
        const regex = /(\d+)/g;
        const lines = string.split("\n");

        const time = parseInt(
            [...lines[0].matchAll(regex)].map((match) => match[1]).join(""),
        );
        const record = parseInt(
            [...lines[1].matchAll(regex)].map((match) => match[1]).join(""),
        );

        this.races = [new Race(time, record)];
    }
}

const sheet = new Sheet(Deno.readTextFileSync("input.txt"));

const winners = sheet.races.map((race) => race.winners.length);

const product = winners.reduce(
    (accumulator, currentValue) => accumulator * currentValue,
    1,
);

console.log(`Product: ${product}`);
