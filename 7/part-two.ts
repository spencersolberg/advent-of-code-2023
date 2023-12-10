enum Card {
    Joker = 0,
    Two = 1,
    Three = 2,
    Four = 3,
    Five = 4,
    Six = 5,
    Seven = 6,
    Eight = 7,
    Nine = 8,
    Ten = 9,
    Queen = 10,
    King = 11,
    Ace = 12,
}

const convertToEnum = (card: string): Card => {
    switch (card) {
        case "J":
            return Card.Joker;
        case "2":
            return Card.Two;
        case "3":
            return Card.Three;
        case "4":
            return Card.Four;
        case "5":
            return Card.Five;
        case "6":
            return Card.Six;
        case "7":
            return Card.Seven;
        case "8":
            return Card.Eight;
        case "9":
            return Card.Nine;
        case "T":
            return Card.Ten;
        case "Q":
            return Card.Queen;
        case "K":
            return Card.King;
        case "A":
            return Card.Ace;
        default:
            throw new Error("Unrecognized card");
    }
};

enum HandType {
    HighCard = 0,
    OnePair = 1,
    TwoPair = 2,
    ThreeOfAKind = 3,
    FullHouse = 4,
    FourOfAKind = 5,
    FiveOfAKind = 6,
}

class Hand {
    cards: Card[];
    bid: number;

    constructor(string: string) {
        const [cardsString, bidString] = string.split(" ");
        const cards = cardsString.split("").map(convertToEnum);

        this.cards = cards;
        this.bid = parseInt(bidString);
    }

    public getType = (): HandType => {
        const groups: Card[][] = [];

        const jokers: Card[] = [];

        for (const card of this.cards) {
            if (card === Card.Joker) {
                jokers.push(card);
                continue;
            }
            let added = false;
            for (const group of groups) {
                if (group.includes(card)) {
                    group.push(card);
                    added = true;
                }
            }
            if (!added) groups.push([card]);
        }

        groups.sort((a, b) => b.length - a.length);

        try {
            groups[0].push(...jokers);
        } catch (_) {
            groups.push(jokers);
        }

        switch (groups[0].length) {
            case 5:
                return HandType.FiveOfAKind;
            case 4:
                return HandType.FourOfAKind;
            case 3:
                if (groups[1].length === 2) {
                    return HandType.FullHouse;
                } else return HandType.ThreeOfAKind;
            case 2:
                if (groups[1].length === 2) {
                    return HandType.TwoPair;
                } else return HandType.OnePair;
            case 1:
                return HandType.HighCard;
        }
        return HandType.FiveOfAKind;
    };

    public display = (): string => {
        return this.cards.map((card) => Card[card]).join(", ");
    };
}

const sorter = (a: Hand, b: Hand): number => {
    if (a.getType() > b.getType()) { // if card a is better than card b return card a
        return -1;
    } else if (a.getType() < b.getType()) { // if card b is better than card a return card b
        return 1;
    } else {
        for (const [i, aCard] of a.cards.entries()) { // otherwise find which one has a higher first, second, etc. card
            if (aCard > b.cards[i]) {
                return -1;
            } else if (aCard < b.cards[i]) {
                return 1;
            }
        }
        return 1;
    }
};

const hands = Deno.readTextFileSync("input.txt").split("\n").map((line) =>
    new Hand(line)
);

hands.sort(sorter);

let totalWinnings = 0;

for (const [i, hand] of hands.entries()) {
    totalWinnings += hand.bid * (hands.length - i);
}

console.log(`Total winnings: ${totalWinnings}`);
