import { assertEquals } from "https://deno.land/std@0.209.0/assert/mod.ts";
import { GardenMap } from "../garden.ts";

Deno.test("overflow position", async (t) => {
    const input = "...........\n.....###.#.\n.###.##..#.\n..#.#...#..\n....#.#....\n.##..S####.\n.##..#...#.\n.......##..\n.##.#.####.\n.##..##.##.\n...........";
    const map = new GardenMap(input);

    console.log(`Rows: ${map.rows.length}, Columns: ${map.rows[0].length}`);

    await t.step("left", () => {
        const overflowPosition = map.fixPosition({ row: 0, column: -1 });
    
        assertEquals(overflowPosition, { row: 0, column: map.rows[0].length - 1 });
    });

    await t.step("right", () => {
        const overflowPosition = map.fixPosition({ row: 0, column: map.rows[0].length });
    
        assertEquals(overflowPosition, { row: 0, column: 0 });
    });

    await t.step("up", () => {
        const overflowPosition = map.fixPosition({ row: -1, column: 0 });
    
        assertEquals(overflowPosition, { row: map.rows.length - 1, column: 0 });
    });

    await t.step("down", () => {
        const overflowPosition = map.fixPosition({ row: map.rows.length, column: 0 });
    
        assertEquals(overflowPosition, { row: 0, column: 0 });
    });

    await t.step("up and left", () => {
        const overflowPosition = map.fixPosition({ row: -1, column: -1 });
    
        assertEquals(overflowPosition, { row: map.rows.length - 1, column: map.rows[0].length - 1 });
    });

    await t.step("up and right", () => {
        const overflowPosition = map.fixPosition({ row: -1, column: map.rows[0].length });
    
        assertEquals(overflowPosition, { row: map.rows.length - 1, column: 0 });
    });

    await t.step("down and left", () => {
        const overflowPosition = map.fixPosition({ row: map.rows.length, column: -1 });
    
        assertEquals(overflowPosition, { row: 0, column: map.rows[0].length - 1 });
    });

    await t.step("down and right", () => {
        const overflowPosition = map.fixPosition({ row: map.rows.length, column: map.rows[0].length });
    
        assertEquals(overflowPosition, { row: 0, column: 0 });
    });

    await t.step("way right", () => {
        // column mappings (11 columns total, 0 to 10):
        // 0 => 0
        // 10 => 10
        // 11 => 0
        // 12 => 1
        // 13 => 2
        // 14 => 3
        // 15 => 4
        // 16 => 5
        // 17 => 6
        // 18 => 7
        // 19 => 8
        // 20 => 9
        // 21 => 10
        // 22 => 0
        // 23 => 1
        const overflowPosition = map.fixPosition({ row: 0, column: 23 });

        assertEquals(overflowPosition, { row: 0, column: 1 });
    });

    await t.step("way left", () => {
        // column mappings (11 columns total, 0 to 10):
        // 0 => 0
        // -1 => 10
        // -2 => 9
        // -3 => 8
        // -4 => 7
        // -5 => 6
        // -6 => 5
        // -7 => 4
        // -8 => 3
        // -9 => 2
        // -10 => 1
        // -11 => 0
        // -12 => 10
        // -13 => 9
        const overflowPosition = map.fixPosition({ row: 0, column: -13 });

        assertEquals(overflowPosition, { row: 0, column: 9 });
    });

    await t.step("way up", () => {
        // row mappings (11 rows total, 0 to 10):
        // 0 => 0
        // -1 => 10
        // -2 => 9
        // -3 => 8
        // -4 => 7
        // -5 => 6
        // -6 => 5
        // -7 => 4
        // -8 => 3
        // -9 => 2
        // -10 => 1
        // -11 => 0
        // -12 => 10
        // -13 => 9
        const overflowPosition = map.fixPosition({ row: -13, column: 0 });

        assertEquals(overflowPosition, { row: 9, column: 0 });
    });

    await t.step("way down", () => {
        // row mappings (11 rows total, 0 to 10):
        // 0 => 0
        // 10 => 10
        // 11 => 0
        // 12 => 1
        // 13 => 2
        // 14 => 3
        // 15 => 4
        // 16 => 5
        // 17 => 6
        // 18 => 7
        // 19 => 8
        // 20 => 9
        // 21 => 10
        // 22 => 0
        // 23 => 1
        const overflowPosition = map.fixPosition({ row: 23, column: 0 });

        assertEquals(overflowPosition, { row: 1, column: 0 });
    });

    await t.step("row -11, column 10", () => {
        const overflowPosition = map.fixPosition({ row: -11, column: 10 });

        assertEquals(overflowPosition, { row: 0, column: 10 });
    })
});

// Deno.test("row and column arrays", async (t) => {
//     const input = "...........\n.....###.#.\n.###.##..#.\n..#.#...#..\n....#.#....\n.##..S####.\n.##..#...#.\n.......##..\n.##.#.####.\n.##..##.##.\n...........";
//     const map = new GardenMap(input);

//     await t.step("row array", () => {
//         assertEquals(map.rowArray, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
//     });

//     await t.step("column array", () => {
//         assertEquals(map.columnArray, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
//     });
// });