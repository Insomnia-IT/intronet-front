import { test } from "node:test";
import { importMovies } from "../data/importMovies";
import { importVurchel } from "../data/importVurchel";

test("should load movies", async () => {
  await importMovies(true);
}, 3000000);

test("should load vurchel", async () => {
  await importVurchel(true);
}, 3000000);
