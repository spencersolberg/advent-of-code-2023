// rome-ignore lint/style/useEnumInitializers: <explanation>
enum AlmanacMapType {
    Soil,
    Fertilizer,
    Water,
    Light,
    Temperature,
    Humidity,
    Location,
}

class AlmanacMapLine {
    destinationRangeStart: number;
    sourceRangeStart: number;
    range: number;

    constructor(
        destinationRangeStart: number,
        sourceRangeStart: number,
        range: number,
    ) {
        this.destinationRangeStart = destinationRangeStart;
        this.sourceRangeStart = sourceRangeStart;
        this.range = range;
    }

    public includes = (number: number): boolean => {
        return this.sourceRangeStart <= number &&
            number <= this.sourceRangeStart + this.range - 1;
    };

    public getCorresponding = (number: number): number => {
        return this.destinationRangeStart + (number - this.sourceRangeStart);
    };
}

class AlmanacMap {
    type: AlmanacMapType;
    lines: AlmanacMapLine[];

    constructor(string: string) {
        const typeRegex = /[a-z]+-to-([a-z]+)/g;
        let type: AlmanacMapType;
        switch ([...string.matchAll(typeRegex)][0][1]) {
            case "soil":
                type = AlmanacMapType.Soil;
                break;
            case "fertilizer":
                type = AlmanacMapType.Fertilizer;
                break;
            case "water":
                type = AlmanacMapType.Water;
                break;
            case "light":
                type = AlmanacMapType.Light;
                break;
            case "temperature":
                type = AlmanacMapType.Temperature;
                break;
            case "humidity":
                type = AlmanacMapType.Humidity;
                break;
            case "location":
                type = AlmanacMapType.Location;
                break;
            default:
                type = AlmanacMapType.Location;
        }

        const lines = string
            .split("\n")
            .slice(1)
            .map(
                (line) =>
                    line.split(" ").map(
                        (num) => parseInt(num),
                    ),
            )
            .map(
                (array) => new AlmanacMapLine(array[0], array[1], array[2]),
            );

        this.type = type;
        this.lines = lines;
    }

    public getCorresponding = (number: number): number => {
        const line = this.lines.find((line) => line.includes(number));
        return line?.getCorresponding(number) ?? number;
    };
}

type AlmanacSeedRange = {
    start: number;
    length: number;
};

class Almanac {
    seedRanges: AlmanacSeedRange[];
    maps: AlmanacMap[];

    constructor(string: string) {
        const rangeRegex = /(\d+ \d+)/g;
        const seedRanges = [
            ...string.split("\n")[0].replace("seeds: ", "").matchAll(
                rangeRegex,
            ),
        ]
            .map(
                (arr) =>
                    arr[1]
                        .split(" ")
                        .map((num) => parseInt(num)),
            )
            .map(
                (arr) => ({
                    start: arr[0],
                    length: arr[1],
                }),
            );

        this.seedRanges = seedRanges;
        this.maps = string.split("\n\n").slice(1).map((m) => new AlmanacMap(m));
    }
}

const almanac = new Almanac(Deno.readTextFileSync("input.txt"));

let lowestLocation = Infinity;
let percent = "0";
let changed = true;
for (const [i, seedRange] of almanac.seedRanges.entries()) {
    for (
        let seed = seedRange.start;
        seed <= seedRange.start + seedRange.length - 1;
        seed++
    ) {
        if (
            percent !==
                ((seed / (seedRange.start + seedRange.length - 1)) * 100)
                    .toFixed(2)
        ) {
            changed = true;
            percent = ((seed / (seedRange.start + seedRange.length - 1)) * 100)
                .toFixed(2);
        }
        changed &&
            console.log(
                `Seed Range ${
                    i + 1
                }/${almanac.seedRanges.length}: ${percent}%, Lowest: ${lowestLocation}`,
            );

        const soil = almanac.maps[0].getCorresponding(seed);
        const fertilizer = almanac.maps[1].getCorresponding(soil);
        const water = almanac.maps[2].getCorresponding(fertilizer);
        const light = almanac.maps[3].getCorresponding(water);
        const temperature = almanac.maps[4].getCorresponding(light);
        const humidity = almanac.maps[5].getCorresponding(temperature);
        const location = almanac.maps[6].getCorresponding(humidity);

        if (location < lowestLocation) lowestLocation = location;
        changed = false;
    }
}
console.log(`Lowest location: ${lowestLocation}`);

almanac.maps.forEach((map) => console.log(map.lines.length));
