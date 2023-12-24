import { assertEquals } from "https://deno.land/std@0.209.0/assert/mod.ts";
import { Brick } from "../lib/snapshot.ts";

Deno.test("get volume", async (t) => {
    await t.step("1 cube brick", () => {
        const brick = new Brick({ x: 2, y: 2, z: 2 }, { x: 2, y: 2, z: 2 });
        assertEquals(brick.getVolume(), 1);
    });
    await t.step("2 cube brick", () => {
        const brick = new Brick({ x: 0, y: 0, z: 10 }, { x: 0, y: 1, z: 10});
        assertEquals(brick.getVolume(), 2);
    });
    await t.step("10 cube brick", () => {
        const brick = new Brick({ x: 0, y: 0, z: 1 }, { x: 0, y: 0, z: 10 });
        assertEquals(brick.getVolume(), 10);
    });
});

Deno.test("get height", async (t) => {
    await t.step("1 tall brick", () => {
        const brick = new Brick({ x: 0, y: 0, z: 1 }, { x: 1_000, y: 0, z: 1 });
        assertEquals(brick.getHeight(), 1);
    });
    await t.step("10 tall brick", () => {
        const brick = new Brick({ x: 34, y: 5, z: 1 }, { x: 1_000, y: 5, z: 10 });
        assertEquals(brick.getHeight(), 10);
    });
});

Deno.test("sort bricks", async (t) => {
    await t.step("sort by z", () => {
        const a = new Brick({ x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 });
        const b = new Brick({ x: 0, y: 0, z: 1 }, { x: 0, y: 0, z: 1 });

        const bricks = [b, a];
        bricks.sort(Brick.sorter);

        assertEquals(bricks, [a, b]);
    });

    await t.step("sort by height", () => {
        const a = new Brick({ x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 });
        const b = new Brick({ x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 1 });

        const bricks = [b, a];
        bricks.sort(Brick.sorter);

        assertEquals(bricks, [a, b]);
    });

    await t.step("sort by volume", () => {
        const a = new Brick({ x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 });
        const b = new Brick({ x: 0, y: 0, z: 0 }, { x: 1, y: 0, z: 0 });

        const bricks = [b, a];
        bricks.sort(Brick.sorter);

        assertEquals(bricks, [a, b]);
    });
});

Deno.test("get coordinates", async (t) => {
    await t.step("1 cube brick", () => {
        const brick = new Brick({ x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 });
        assertEquals(brick.getCoordinates(), [{ x: 0, y: 0, z: 0 }]);
    });
    await t.step("2 cube brick", () => {
        const brick = new Brick({ x: 0, y: 0, z: 0 }, { x: 1, y: 0, z: 0 });
        assertEquals(brick.getCoordinates(), [{ x: 0, y: 0, z: 0 }, { x: 1, y: 0, z: 0 }]);
    });
    await t.step("10 cube brick", () => {
        const brick = new Brick({ x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 9 });
        assertEquals(brick.getCoordinates().length, 10);
    });
    await t.step("6 cube brick (2d)", () => {
        const brick = new Brick({ x: 0, y: 0, z: 0 }, { x: 1, y: 2, z: 0 });
        assertEquals(brick.getCoordinates().length, 6);
    });
    await t.step("12 cube brick (3d)", () => {
        const brick = new Brick({ x: 0, y: 0, z: 0 }, { x: 1, y: 2, z: 1 });
        assertEquals(brick.getCoordinates().length, 12);
    });
});

Deno.test("collides with", async (t) => {
    await t.step("no collision", () => {
        const a = new Brick({ x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 });
        const b = new Brick({ x: 1, y: 1, z: 1 }, { x: 1, y: 1, z: 1 });
        assertEquals(a.collidesWith(b), false);
    });

    await t.step("collision", () => {
        const a = new Brick({x: 0, y: 0, z: 0}, {x: 1, y: 1, z: 1});
        const b = new Brick({x: 1, y: 1, z: 1}, {x: 2, y: 2, z: 2});
        assertEquals(a.collidesWith(b), true);
    });
});