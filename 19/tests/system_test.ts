import { assertEquals } from "https://deno.land/std@0.209.0/assert/mod.ts";
import { System } from "../lib/system.ts";

Deno.test("parse parts", () => {
    const string = "{x=787,m=2655,a=1222,s=2876}";

    const { extremelyCoolLooking: actual } = System.parseParts(string)[0];
    const expected = 787;

    assertEquals(actual, expected);
});