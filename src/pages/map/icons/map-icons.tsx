import { SvgIcon } from "@icons";
import { FunctionalComponent } from "preact";

export const MapIcon: FunctionalComponent<{ id: string }> = ({ id }) => {
  const type = directionsToIcon.get(id);
  const color = (() => {
    switch (type){
      case IconsTypes.Info:
        return '#1C2973';
      case IconsTypes.Screens:
        return '#536BF3';
      case IconsTypes.Cafe:
        return '#60D67A';
      case IconsTypes.WC:
        return '#45D2F1';
      case IconsTypes.Other:
        return '#FE4BA9';
      default:
        return 'black'
    }
  })();
  const form = (() => {
    switch (type){
      case IconsTypes.Info:
      case IconsTypes.Screens:
        return 'start';
      default:
        return 'circle';
    }
  })();

  if(color === "black") {
    console.log(id, type, color, form);
  }
  return <SvgIcon id={".map #" + form} style={{ '--color': color }} size="20em" overflow="visible" />;
};

enum IconsTypes {
  MainZone = "MainZone",
  Main = "Main",
  Screens = "Screens",
  Info = "Info",
  Cafe = "Cafe",
  WC = "WC",
  Other = "Other",
  Unknown = "Unknown",
}

const directionsToIcon = new Map([
  ["Медпункт (Медицинская Служба)", IconsTypes.Info],
  ["КПП", IconsTypes.Main],
  ["Баня", IconsTypes.WC],
  [
    "Точка Сборки (Место Встречи И Помощь В Поиске Потерянных Люде",
    IconsTypes.Info,
  ],
  ["Детская Площадка", IconsTypes.Other],
  ["", IconsTypes.Other],
  ["Мастер-Классы", IconsTypes.Other],
  ["Туалет", IconsTypes.WC],
  ["Ярмарка", IconsTypes.Other],
  ["Автолагерь", IconsTypes.MainZone],
  ["Лекторий", IconsTypes.Other],
  ["Фудкорт", IconsTypes.Cafe],
  ["Кафе", IconsTypes.Cafe],
  ["КАФЕ", IconsTypes.Cafe],
  ["Ветви Дерева", IconsTypes.Other],
  ["Спортплощадка", IconsTypes.Other],
  ["Души", IconsTypes.WC],
  ["Музыкальная Сцена", IconsTypes.Other],
  ["Театральная Сцена", IconsTypes.Other],
  ["Гостевые Кемпинги", IconsTypes.MainZone],
  ["Экран", IconsTypes.Screens],
  ["Инфоцентр", IconsTypes.Info],
]);
