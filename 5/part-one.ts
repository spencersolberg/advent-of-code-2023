// rome-ignore lint/style/useEnumInitializers: <explanation>
enum AlmanacMapType {
    Soil,
    Fertilizer,
    Water,
    Light,
    Temperature,
    Humidity,
    Location
}

class AlmanacMapLine {
    destinationRangeStart: number;
    sourceRangeStart: number;
    range: number;

    constructor(destinationRangeStart: number, sourceRangeStart: number, range: number) {
        this.destinationRangeStart = destinationRangeStart;
        this.sourceRangeStart = sourceRangeStart;
        this.range = range;
    }
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
                line => line.split(" ").map(
                    num => parseInt(num)
                )
            )
            .map(
                array => new AlmanacMapLine(array[0], array[1], array[2])
            );
        
        this.type = type;
        this.lines = lines;
    }

    public getCorresponding = (number: number): number => {
        let corresponding = number;
        for (const line of this.lines) {
            if (line.sourceRangeStart <= number && number <= line.sourceRangeStart + line.range - 1) {
                corresponding = line.destinationRangeStart + (number - line.sourceRangeStart)
            }
        }
        return corresponding;
    }

}

class Almanac {
    seeds: number[];
    maps: AlmanacMap[];

    constructor(string: string) {
        this.seeds = string.split("\n")[0].replace("seeds: ", "").split(" ").map(num => parseInt(num));
        this.maps = string.split("\n\n").slice(1).map(m => new AlmanacMap(m));
    }
}

const almanac = new Almanac(Deno.readTextFileSync("input.txt"));

const soils: number[] = [];
for (const seed of almanac.seeds) {
    soils.push(almanac.maps[0].getCorresponding(seed));
}
const fertilizers: number[] = [];
for (const soil of soils) {
    fertilizers.push(almanac.maps[1].getCorresponding(soil));
}

const waters: number[] = [];
for (const fertilizer of fertilizers) {
    waters.push(almanac.maps[2].getCorresponding(fertilizer));
}

const lights: number[] = [];
for (const water of waters) {
    lights.push(almanac.maps[3].getCorresponding(water));
}

const temperatures: number[] = [];
for (const light of lights) {
    temperatures.push(almanac.maps[4].getCorresponding(light));
}

const humidities: number[] = [];
for (const temperature of temperatures) {
    humidities.push(almanac.maps[5].getCorresponding(temperature));
}

const locations: number[] = [];
for (const humidity of humidities) {
    locations.push(almanac.maps[6].getCorresponding(humidity));
}

console.log(`Lowest location: ${Math.min(...locations)}`);