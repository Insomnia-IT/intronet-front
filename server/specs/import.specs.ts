import { it, describe } from "node:test";
import { importMovies } from "../data/importMovies";
import { importVurchel } from "../data/importVurchel";
import { importLocations } from "../data/importLocations";
import { importActivities } from "../data/importActivities";
import { importMainPage } from "../data/import";
import { importShops } from "../data/importShops";
import { importEvents } from "../data/importEvents";

describe("import", { timeout: 2 ** 30 }, () => {
  it("events", () => importEvents());
  it("locations", () => importLocations(true));
  it("activities", () => importActivities(true));
  it("movies", () => importMovies(true));
  it("vurchel", () => importVurchel(true));
  it("shops", () => importShops(true));
  it("mainPage", () => importMainPage(true));
});
