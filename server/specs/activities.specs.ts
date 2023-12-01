import { test } from "node:test";
import { importActivities } from "../data/importActivities";

test("should load locations", async () => {
  await importActivities(true);
}, 3000000);
