import { test } from "node:test";
import { importLocations } from "../data/importLocations";

test("should load locations", async () => {
  await importLocations(true);
}, 3000000);
