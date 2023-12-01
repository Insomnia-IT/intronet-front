import {it, expect} from "node:test";
import {importLocations} from "../data/importLocations";

it("should load locations", async () => {
  await importLocations(true);
}, 3000000);
