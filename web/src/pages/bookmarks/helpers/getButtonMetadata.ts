import { RoutePath, RoutePathString } from "../../routing";

/**
 * Возвращает данные для кнопки в ButtonsBar для разных вариантов страницы Избранное
 */
export const getButtonMetadata = (type: Bookmark["type"]): {
  buttonRoute: RoutePath | RoutePathString,
  buttonTitle: string;
} | null => {
  switch (type) {
    case "movie":
      return {
        buttonRoute: '/timetable',
        buttonTitle: 'К расписанию анимации'
      }
    case "activity":
      return {
        buttonRoute: '/activities',
        buttonTitle: 'К расписанию неанимации'
      }
    case "locations":
      return {
        buttonRoute: '/map',
        buttonTitle: 'На карту'
      }
    case "note":
      return {
        buttonRoute: '/notes',
        buttonTitle: 'К объявлениям'
      }
    default:
      return null;
  }
}
