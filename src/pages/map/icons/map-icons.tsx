import { SvgIcon } from "@icons";
import { FunctionalComponent } from "preact";

export const MapIcon: FunctionalComponent<{ id: string }> = ({ id }) => {
  const name = directionsToIcon.get(id);
  console.log(name, id)
  return <SvgIcon id={".map #" + name} size="20em" overflow="visible" />;
};

enum IconsTypes {
  MainZone= 'MainZone',
  Main= 'Main',
  Screens= 'Screens',
  Info= 'Info',
  Cafe= 'Cafe',
  WC= 'WC',
  Other= 'Other',
  Unknown = 'Unknown'
}

const directionsToIcon = new Map([
  ["Медпункт (Медицинская Служба)", IconsTypes.Info],
  ["КПП", IconsTypes.Main],
  ["Баня", IconsTypes.WC],
  ["Точка Сборки (Место Встречи И Помощь В Поиске Потерянных Люде", IconsTypes.Info],
  ["Детская Площадка", IconsTypes.Other],
  ["", IconsTypes.Other],
  ["Мастер-Классы", IconsTypes.Other],
  ["Туалет", IconsTypes.WC],
  ["Ярмарка", IconsTypes.Other],
  ["Автолагерь", IconsTypes.MainZone],
  ["Лекторий", IconsTypes.Other],
  ["Фудкорт", IconsTypes.Cafe],
  ["Кафе", IconsTypes.Cafe],
  ["Ветви Дерева", IconsTypes.Unknown],
  ["Спортплощадка", IconsTypes.Other],
  ["Душевная Команда", IconsTypes.WC],
  ["Музыкальная Сцена", IconsTypes.Other],
  ["Театральная Сцена", IconsTypes.Other],
  ["Гостевые Кемпинги", IconsTypes.MainZone],
  ["Экран", IconsTypes.Screens],
  ["Инфоцентр", IconsTypes.Info]
]);
