import { assertEquals } from "https://deno.land/std@0.209.0/assert/mod.ts";
import { Contraption, Direction, push, TileType } from "../lib/contraption.ts";

Deno.test("construct contraption", async (t) => {
    const string =
        ".|...\....\n|.-.\\.....\n.....|-...\n........|.\n..........\n.........\\\n..../.\\\\..\n.-.-/..|..\n.|....-|.\\\n..//.|....";
    let contraption: Contraption;

    await t.step("create contraption", () => {
        contraption = new Contraption(string);
    });

    await t.step("check contraption", () => {
        const actual = contraption.rows[1][0];
        const expected = TileType.VerticalSplitter;

        assertEquals(actual.type, expected);
    });
});

Deno.test("contraption to string", () => {
    const string =
        ".|...\....\n|.-.\\.....\n.....|-...\n........|.\n..........\n.........\\\n..../.\\\\..\n.-.-/..|..\n.|....-|.\\\n..//.|....";
    const contraption = new Contraption(string);

    assertEquals(contraption.toString(), string);
});

Deno.test("push", () => {
    const position = { row: 0, column: 0 };
    const direction = Direction.Down;

    const expected = { row: 1, column: 0 };
    const actual = push(position, direction);

    assertEquals(actual, expected);
});
