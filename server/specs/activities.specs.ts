import {it, expect} from "@jest/globals";
import {importActivities} from "../data/importActivities";
import {importLocations} from "../data/importLocations";

it("should load locations", async () => {
  await importActivities(true);
}, 3000000);
