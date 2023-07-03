import {it, expect} from "@jest/globals";
import {getDay} from "../../src/helpers/getDayText";
import {importMovies} from "../data/importMovies";
import {importVurchel} from "../data/importVurchel";

it("should load movies", async () => {
  await importMovies(true);
}, 3000000);

it("should load vurchel", async () => {
  await importVurchel(true);
}, 3000000);


it('should return day 4', () => {
  const day = getDay(1689534000*1000);
  expect(day).toEqual(3)
})
