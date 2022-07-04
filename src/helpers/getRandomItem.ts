import { shuffle } from "./shuffle";

export const getRandomItem = <T extends Array<any>>(array: T): T[number] =>
  shuffle(array)[0];
