export const shuffle = <T extends Array<any>>(array: T): T => {
  const res = Object.assign([], array);

  for (let i = res.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));

    [res[i], res[j]] = [res[j], res[i]];
  }

  return res;
};
