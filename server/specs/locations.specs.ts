import {it, expect} from "@jest/globals";
import {importLocations} from "../data/importLocations";
import {importMovies} from "../data/importMovies";
import {importVurchel} from "../data/importVurchel";

it("should load movies", async () => {
  await importLocations(true);
}, 3000000);
