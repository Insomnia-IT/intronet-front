
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
      return namesShort[day]?.slice(0, 2) ?? '-';
    }
    default:
      return names[day];
  }
}

export function getCurrentDay(): Day {
  return getDay(Date.now() - 12*60*60*1000);
}

export function getDay(utc: number): Day {
  const day = (new Date(utc).getDay() + 3) % 7; // четверг = 0
  if (day > 4) return 0;

  return day as Day;
}

export function getTimeComparable(time: string): string{
  if (time.startsWith('0')) return  '3' + time;
  return  time;
}
export function getTime(local: Date): string{
  const hour = local.getHours();
  const minutes = local.getMinutes();
  return `${hour < 10 ?'0'+hour : hour}:${minutes < 10 ? '0'+minutes : minutes}`;
}

export function getCurrentHour() {
  const hour = new Date().getHours();
  switch (true) {
    case hour < 13:
      return 9;
    case hour < 17:
      return 13;
    case hour < 24:
      return 17;
  }
}

export const isInTimePeriod = (hour: number, filter: 9 | 13 | 17): boolean => {
  switch (filter) {
    case 9:
      return hour < 13 && hour > 9;
    case 13:
      return hour >= 13 && hour < 17;
    case 17:
      return (hour >= 17 && hour < 24) || (hour < 9);
  }
};

export const parseTime = (time: string): string => {
  const [hours, minutes] = [...time.matchAll(/\d{2}/gm)];
  return `${hours}:${minutes}`;
};

export const coerceHour = (hour: unknown): hour is 9 | 13 | 17 => {
  return hour === 9 || hour === 13 || hour === 17;
};

export const getDayNumber = (day: number) => {
  return day - 13;
}

export const namesShort = ["чт 18", "пт 19", "сб 20", "вс 21", "пн 22"];
const namesFull = [
  "Четверг, 18 июля",
  "Пятница, 19 июля",
  "Суббота, 20 июля",
  "Воскресенье, 21 июля",
  "Понедельник, 22 июля",
];
const names = ["четверг", "пятница", "суббота", "воскресенье", "понедельник"];
const namesAt = [
  "в четверг",
  "в пятницу",
  "в субботу",
  "в воскресенье",
  "в понедельник",
];
