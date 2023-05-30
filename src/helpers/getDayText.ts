export function getDayText(
  day: number,
  type?: "at" | "short" | "full" | "shortWD"
) {
  if (day < 0) day = 0;
  if (!type) return names[day];

  switch (type) {
    case "short":
      return namesShort[day];
    case "full":
      return namesFull[day];
    case "at": {
      const today = getCurrentDay();
      if (today == day) return `сегодня`;
      if (day == today - 1) return `вчера`;
      if (day == today + 1) return `завтра`;
      return namesAt[day];
    }
    case "shortWD": {
      return namesShort[day].slice(0, 2);
    }
    default:
      return names[day];
  }
}

export function getCurrentDay(): Day {
  return getDay(Date.now());
}

export function getDay(utc: number): Day {
  const day = new Date(utc).getDay() - 4; // четверг = 0

  if (day === -3) return 4;
  if (day < 0) return 0;

  return day as Day;
}

const namesShort = ["чт 13", "пт 14", "сб 15", "вс 16", "пн 17"];
const namesFull = [
  "Четверг, 13 июля",
  "Пятница, 14 июля",
  "Суббота, 15 июля",
  "Воскресенье, 16 июля",
  "Понедельник, 17 июля",
];
const names = ["четверг", "пятница", "суббота", "воскресенье", "понедельник"];
const namesAt = [
  "в четверг",
  "в пятницу",
  "в субботу",
  "в воскресенье",
  "в понедельник",
];
