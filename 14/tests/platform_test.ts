import { assert } from "https://deno.land/std@0.209.0/assert/assert.ts";
import { Platform, Direction } from "../lib/platform.ts";
import { assertNotEquals, assertEquals } from "https://deno.land/std@0.209.0/assert/mod.ts";

Deno.test("transpose grid", async (t) => {
    const string = "O....#....\nO.OO#....#\n.....##...\nOO.#O....O\n.O.....O#.\nO.#..O.#.#\n..O..#O..O\n.......O..\n#....###..\n#OO..#....";

    const platform = new Platform(string);

    await t.step("transpose once", () => {
        const once = Platform.transposeGrid(platform.rows);
        assertNotEquals(once, platform.rows);
    });

    await t.step("transpose twice", () => {
        const once = Platform.transposeGrid(platform.rows);
        const twice = Platform.transposeGrid(once);
        assertEquals(twice, platform.rows);
    });
});

Deno.test("tilt north", async (t) => {
    const string = "O....#....\nO.OO#....#\n.....##...\nOO.#O....O\n.O.....O#.\nO.#..O.#.#\n..O..#O..O\n.......O..\n#....###..\n#OO..#....";

    const platform = new Platform(string);

    await t.step("tilt", () => {
        platform.tilt(Direction.North);
    
        const actual = platform.toString();
        const expected = "OOOO.#.O..\nOO..#....#\nOO..O##..O\nO..#.OO...\n........#.\n..#....#.#\n..O..#.O.O\n..O.......\n#....###..\n#....#....";
    
        assertEquals(actual, expected);
    });

    await t.step("load", () => {
        assertEquals(platform.getLoad(), 136);
    })
});

Deno.test("cycle platform", async (t) => {
    const string = "O....#....\nO.OO#....#\n.....##...\nOO.#O....O\n.O.....O#.\nO.#..O.#.#\n..O..#O..O\n.......O..\n#....###..\n#OO..#....";

    const platform = new Platform(string);

    platform.cycle();

    const actual = platform.toString();
    const expected = ".....#....\n....#...O#\n...OO##...\n.OO#......\n.....OOO#.\n.O#...O#.#\n....O#....\n......OOOO\n#...O###..\n#..OO#....";

    assertEquals(actual, expected);
})