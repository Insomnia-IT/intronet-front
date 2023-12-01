import { test } from "node:test";
import { importShops } from "../data/importShops";

test("should load shops", async () => {
  await importShops(true);
}, 3000000);
