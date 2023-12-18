import { assertEquals } from "https://deno.land/std@0.209.0/assert/mod.ts";
import { City, HeatLoss } from "../lib/city.ts";

Deno.test("construct city", async (t) => {
    const input = "2413432311323\n3215453535623\n3255245654254\n3446585845452\n4546657867536\n1438598798454\n4457876987766\n3637877979653\n4654967986887\n4564679986453\n1224686865563\n2546548887735\n4322674655533";
    let city: City;
    await t.step("construct city", () => {
        city = new City(input);
    });

    await t.step("check block", () => {
        const actual = city.rows[1][0].heatLoss;
        const expected = HeatLoss.Three;

        assertEquals(actual, expected);
    });
});