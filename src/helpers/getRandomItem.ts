export const getRandomItem = <T extends Array<any>>(array: T): T[number] =>
  array[Math.floor(Math.random()*array.length)];
