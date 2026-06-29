
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
      return namesAt[day];
    }
    case "shortWD": {
      return namesShort[day]?.slice(0, 2) ?? '-';
    }
    default:
      return names[day];
  }
}

export function getCurrentDay(): Day {
  return getDay(Date.now() - 8.5*60*60*1000);
}

export function getDay(utc: number): Day {
  const day = (new Date(utc).getDay() + 3) % 7; // четверг = 0
  if (day > 4) return 0;

  return day as Day;
}

export function getTimeComparable(time: string): string{
  if (+time.split(':')[0] < 8) return  '3' + time;
  return time;
}
export function getTime(local: Date): string{
  const hour = local.getHours();
  const minutes = local.getMinutes();
  return `${hour < 10 ?'0'+hour : hour}:${minutes < 10 ? '0'+minutes : minutes}`;
}

export function getCurrentHour() {
  const hour = new Date().getHours();
  if (hour < 8 || hour >= 21) return 21;
  if (hour < 13) return 8;
  if (hour < 17) return 13;
  return 17;
}

export const isInTimePeriod = (hour: number, filter: 8 | 13 | 17 | 21): boolean => {
  switch (filter) {
    case 8:
      return hour < 13 && hour >= 8;
    case 13:
      return hour >= 13 && hour < 17;
    case 17:
      return hour >= 17 && hour < 21;
    case 21:
      return hour >= 21 || hour < 8;
  }
};

export const parseTime = (time: string): string => {
  const [hours, minutes] = [...time.matchAll(/\d{2}/gm)];
  return `${hours}:${minutes}`;
};

export const coerceHour = (hour: unknown): hour is 8 | 13 | 17 | 21 => {
  return hour === 8 || hour === 13 || hour === 17 || hour === 21;
};

export const getDayNumber = (day: number) => {
  return day - 13;
}

export const namesShort = ["чт 9", "пт 10", "сб 11", "вс 12", "пн 13"];
const namesFull = [
  "Четверг, 9 июля",
  "Пятница, 10 июля",
  "Суббота, 11 июля",
  "Воскресенье, 12 июля",
  "Понедельник, 13 июля",
];
const names = ["четверг", "пятница", "суббота", "воскресенье", "понедельник"];
const namesAt = [
  "в четверг",
  "в пятницу",
  "в субботу",
  "в воскресенье",
  "в понедельник",
];
