import {it, expect} from "node:test";
import {importActivities} from "../data/importActivities";
import {importLocations} from "../data/importLocations";

it("should load locations", async () => {
  await importActivities(true);
}, 3000000);
