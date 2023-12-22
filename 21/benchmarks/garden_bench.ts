import { GardenMap } from "../garden.ts";

const input = "...........\n.....###.#.\n.###.##..#.\n..#.#...#..\n....#.#....\n.##..S####.\n.##..#...#.\n.......##..\n.##.#.####.\n.##..##.##.\n...........";

const map = new GardenMap(input);

// Deno.bench("6 steps, finite", () => {
//     map.step(6);
// });

Deno.bench("6 steps, infinite", () => {
    map.step(6, true);
});

Deno.bench("10 steps, infinite", () => {
    map.step(10, true);
});

// Deno.bench("50 steps, infinite", () => {
//     map.step(50, true);
// });