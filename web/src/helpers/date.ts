export const getCurrentDate = () => {
  const currentDate = new Date().getDate();

  // TODO: переделать систему дат фестиваля
  // '% 14' - Костыль для того чтобы проверка актуальности объявлений работала для дат вне рамок фестиваля
  return currentDate % 14;
};

export const getCurrentUtc = () => {
  return Date.now();
};
