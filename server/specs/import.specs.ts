import { it, describe, after } from "node:test";
import { importMovies } from "../data/importMovies";
import { importVurchel } from "../data/importVurchel";
import { importLocations } from "../data/importLocations";
import { importActivities } from "../data/importActivities";
import { importShops } from "../data/importShops";
import { importEvents } from "../data/importEvents";
import { Database } from "../database";

describe("import", { timeout: 2 ** 30 }, () => {
  it("events", () => importEvents());
  it("locations", () => importLocations(true));
  it("activities", () => importActivities(true));
  it("movies", () => importMovies(true));
  it("vurchel", () => importVurchel(true));
  it("shops", () => importShops(true));
  after(() => Database.close());
});
