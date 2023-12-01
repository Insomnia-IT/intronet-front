import {it, expect} from "fs";
import {importLocations} from "../data/importLocations";
import {importMovies} from "../data/importMovies";
import {importShops} from "../data/importShops";
import {importVurchel} from "../data/importVurchel";

it("should load shops", async () => {
  await importShops(true);
}, 3000000);
