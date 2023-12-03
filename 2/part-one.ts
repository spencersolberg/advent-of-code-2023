type Set = {
    red: number;
    green: number;
    blue: number;
}

const games = Deno.readTextFileSync("input.txt").split("\n");
const quotas: Set = {
    red: 12,
    green: 13,
    blue: 14
}

const getGameId = (game: string): number => {
    const regex = /Game ([0-9]+): /gm;
    const id = parseInt([...game.matchAll(regex)][0][1])
    return id;
}

const getSets = (game: string): string[] => {
    const regex = /Game [0-9]+: /gm;
    return game.replace(regex, "").split(";").map(s => s.trim());
}

const validateSet = (set: string): boolean => {
    const parsedSet = parseSet(set);
    if (
        parsedSet.red > quotas.red ||
        parsedSet.blue > quotas.blue ||
        parsedSet.green > quotas.green
    ) return false;
    return true;
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

let sum = 0;

for (const game of games) {
    const sets = getSets(game);
    const id = getGameId(game);
    // console.log({ game, sets, id });
    let valid = true;

    for (const set of sets) {
        if (!validateSet(set)) {
            valid = false;
            break;
        }
    }

    if (valid) sum+= id;
}

console.log(`Sum: ${sum}`);