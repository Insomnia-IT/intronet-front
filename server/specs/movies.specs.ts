import {it, expect} from "@jest/globals";
import {importMovies} from "../data/importMovies";
import {importVurchel} from "../data/importVurchel";

it("should load movies", async () => {
  await importMovies(true);
}, 3000000);

it("should load vurchel", async () => {
  await importVurchel(true);
}, 3000000);

