export const getFullTime = (utc: number) => {
  const date = new Date(utc);

  return date.toLocaleTimeString("ru-RU", {
    hour12: false,
    timeZone: "Europe/Moscow",
  });
};
