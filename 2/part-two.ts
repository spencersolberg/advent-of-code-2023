type Set = {
    red: number;
    green: number;
    blue: number;
}

const games = Deno.readTextFileSync("input.txt").split("\n");

const getSets = (game: string): string[] => {
    const regex = /Game [0-9]+: /gm;
    return game.replace(regex, "").split(";").map(s => s.trim());
}

const parseSet = (set: string): Set => {
    const cubes = set.split(",").map(cube => cube.trim());
    // console.log({ set, cubes })
    const regex = /([0-9]+) (blue|red|green)/gm;
    const parsedSet = {
        red: 0,
        green: 0,
        blue: 0
    }

    for (const cube of cubes) {
        const match = [...cube.matchAll(regex)][0]
        // console.log(match);
        const [_, quantity, color] = match;
        // console.log({ quantity, color });
        parsedSet[color as "red" | "green" | "blue"] = parseInt(quantity);
    }

    // console.log({ set, parsedSet });
    return parsedSet;
}

const getMinimumSet = (sets: Set[]): Set => {
    const minimumSet: Set = {
        red: 0,
        green: 0,
        blue: 0
    }

    for (const set of sets) {
        if (set.red > minimumSet.red) minimumSet.red = set.red;
        if (set.green > minimumSet.green) minimumSet.green = set.green;
        if (set.blue > minimumSet.blue) minimumSet.blue = set.blue;
    }

    return minimumSet;
}

let sum = 0;

for (const game of games) {
    const sets = getSets(game).map(set => parseSet(set));
    
    const minimumSet = getMinimumSet(sets);

    sum += (minimumSet.red * minimumSet.green * minimumSet.blue);
}

console.log(sum);