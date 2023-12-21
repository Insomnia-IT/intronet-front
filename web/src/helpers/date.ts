/* ! До феста значение замокано на один из дней феста ! */
export const getCurrentDate = () => {
  return 13;
  // const currentDate = new Date().getDate();
  //
  // return currentDate > 12 ? currentDate : 14;
};

export const getCurrentUtc = () => {
  return Date.now();
};
