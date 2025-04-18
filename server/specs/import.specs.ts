import {test, describe} from "node:test";
import {importMovies} from "../data/importMovies";
import {importVurchel} from "../data/importVurchel";
import {importLocations} from "../data/importLocations";
import {importActivities} from "../data/importActivities";
import {importMainPage} from "../data/import";
import {importShops} from "../data/importShops";


describe('import', {timeout: 2 ** 30}, () => {
  test('locations', () => importLocations(true));
  test('activities', () => importActivities(true));
  test('movies', () => importMovies(true));
  test('vurchel', () => importVurchel(true));
  test('shops', () => importShops(true));
  test('mainPage', () => importMainPage(true));
});
