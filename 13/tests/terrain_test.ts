import { assertEquals } from "https://deno.land/std@0.209.0/assert/mod.ts";
import { Terrain, Reflection, ReflectionAxis } from "../lib/terrain.ts";

Deno.test("compare grids", (t) => {
    const aString = "#####.##.\n..##..###\n#....#..#";
    const bString = "#####.##.\n..##..###\n#....#..#";

    const a = new Terrain(aString);
    const b = new Terrain(bString);

    assertEquals(Terrain.compareGrids(a.grid, b.grid), true); 
});

Deno.test("horizontal reflection", (t) => {
    const string = "#...##..#\n#....#..#\n..##..###\n#####.##.\n#####.##.\n..##..###\n#....#..#";
    const terrain = new Terrain(string);

    const actual = terrain.getReflection();
    const expected: Reflection = { axis: ReflectionAxis.Horizontal, start: 3 };

    assertEquals(actual, expected);
});

Deno.test("vertical reflection", (t) => {
    const string = "#.##..##.\n..#.##.#.\n##......#\n##......#\n..#.##.#.\n..##..##.\n#.#.##.#.";
    // const string ="#...##..#\n#....#..#\n..##..###\n#####.##.\n#####.##.\n..##..###\n#....#..#";

    const terrain = new Terrain(string);

    const actual = terrain.getReflection();
    const expected: Reflection = { axis: ReflectionAxis.Vertical, start: 4 };

    assertEquals(actual, expected);
})