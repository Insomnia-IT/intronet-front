import { getDay, getDayText } from "../../../helpers/getDayText";
import { getFullTime } from "../../../helpers/getFullTime";

export const getNoteDate = (utc: number) => {
  const time = getFullTime(utc).slice(0, -3);
  const weekDay = getDayText(getDay(utc), "shortWD").toUpperCase();

  return `${time} ${weekDay}`;
};
