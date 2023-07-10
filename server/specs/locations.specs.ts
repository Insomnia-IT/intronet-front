import {it, expect} from "@jest/globals";
import {importLocations} from "../data/importLocations";

it("should load locations", async () => {
  await importLocations(true);
}, 3000000);
