import { assertEquals } from "https://deno.land/std@0.209.0/assert/mod.ts";
import { hash } from "../lib/hash.ts";

Deno.test("hash", () => {
    const string = "HASH";

    const actual = hash(string);
    const expected = 52;

    assertEquals(actual, expected);
});