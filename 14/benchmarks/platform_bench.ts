import { Platform } from "../lib/platform.ts";

Deno.bench("1,000 cycles", () => {
    const string = "O....#....\nO.OO#....#\n.....##...\nOO.#O....O\n.O.....O#.\nO.#..O.#.#\n..O..#O..O\n.......O..\n#....###..\n#OO..#....";

    const platform = new Platform(string);

    platform.cycle(1_000);
});