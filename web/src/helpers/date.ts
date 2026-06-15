export const getCurrentDate = () => {
  const currentDate = new Date().getDate();

  return currentDate;
};

export const getCurrentUtc = () => {
  return Date.now();
};
