export function getDayText(day: number){
  const today = getCurrentDay();
  if (today == day)
    return `сегодня`;
  if (day == today - 1)
    return `вчера`;
  if (day == today + 1)
    return `завтра`;
  return `в ${names[day]}`;
}

export function getCurrentDay(){
  return new Date().getDay() - 4; // четверг = 0
}

const names = [
  'четверг',
  'пятница',
  'суббота',
  'воскресенье',
  'понедельник',
]
