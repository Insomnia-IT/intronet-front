import { getCurrentDate } from "../../../helpers/date";
import { getDayNumber, getDayText } from "../../../helpers/getDayText";

export const getNoteTTLText = ({
  isDeleted = false,
  deletedAt = 0,
  TTL = 13,
}) => {
  const deletedDate = isDeleted && deletedAt ? deletedAt : TTL;
  const dateText = `${deletedDate} июля (${getDayText(
    getDayNumber(deletedDate)
  )})`;

  return deletedDate <= getCurrentDate()
    ? `Удалено ${dateText}`
    : `В конце ${dateText} удалим объявление автоматически`;
};
