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
  if (!date) return "";
  // example date - 06/28/2022 13:12:23

  const [dateD, dateT] = date.split(" ");
  const dateDArr: string[] = dateD.split("/");
  [dateDArr[0], dateDArr[1]] = [dateDArr[1], dateDArr[0]];
  const ISODate: string = dateDArr.reverse().join("-");
  const ISOString = ISODate + "T" + dateT;
  const ISOStringWithTimeZone = ISOString + "+03:00";
  const dateObj = new Date(ISOStringWithTimeZone);
  let firstPart: string;

  const nowDay = new Date();
  if (
    dateObj.getFullYear() === nowDay.getFullYear() &&
    dateObj.getMonth() === nowDay.getMonth() &&
    dateObj.getDate() === nowDay.getDate()
  ) {
    firstPart = "Сегодня";
  } else if (
    dateObj.getFullYear() === nowDay.getFullYear() &&
    dateObj.getMonth() === nowDay.getMonth() &&
    dateObj.getDate() === nowDay.getDate() - 1
  ) {
    firstPart = "Вчера";
  } else {
    firstPart = weekdayList[dateObj.getDay()];
  }

  const secondPart = dateObj
    .toLocaleTimeString("ru-RU", { hour12: false })
    .slice(0, -3);

  return `${firstPart}, ${secondPart}`;
};
