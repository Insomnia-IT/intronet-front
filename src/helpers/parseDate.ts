export const weekdayList: string[] = [
  "Воскресенье",
  "Понедельник",
  "Вторник",
  "Среда",
  "Четверг",
  "Пятница",
  "Суббота",
];

export const parseDate = (date: string): string => {
  // example date - 06/28/2022 13:12:23

  const [dateD, dateT] = date.split(" ");
  const dateDArr: string[] = dateD.split("/");
  [dateDArr[0], dateDArr[1]] = [dateDArr[1], dateDArr[0]];
  const ISODate: string = dateDArr.reverse().join("-");
  const ISOString = ISODate + "T" + dateT;
  const ISOStringWithTimeZone = ISOString + "+03:00";
  const dateObj = new Date(ISOStringWithTimeZone);
  const weekday = weekdayList[dateObj.getDay()];
  const time = dateObj
    .toLocaleTimeString("ru-RU", { hour12: false })
    .slice(0, -3);

  return `${weekday}, ${time}`;
};
