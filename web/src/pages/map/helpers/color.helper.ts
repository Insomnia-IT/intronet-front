export enum IconsTypes {
  MainZone = "MainZone",
  Main = "Main",
  Screens = "Screens",
  Info = "Info",
  Cafe = "Cafe",
  WC = "WC",
  Other = "Other",
  Unknown = "Unknown",
}

export const directionsToIcon = new Map([
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
  ["Музыка", IconsTypes.Other],
  ["Театральная Сцена", IconsTypes.Other],
  ["Гостевые Кемпинги", IconsTypes.MainZone],
  ["Экран", IconsTypes.Screens],
  ["Инфоцентр", IconsTypes.Info],
]);

export const getLocationColor = (type: IconsTypes): string => {
  switch (type) {
    case IconsTypes.Info:
      return "#1C2973";
    case IconsTypes.Screens:
      return "#536BF3";
    case IconsTypes.Cafe:
      return "#60D67A";
    case IconsTypes.WC:
      return "#45D2F1";
    case IconsTypes.Other:
      return "#FE4BA9";
    default:
      return "black";
  }
};

export const getLocationIconSrc = (type: IconsTypes): string => {
  switch (type) {
    case IconsTypes.MainZone:
      return ".map #tent";
    case IconsTypes.Main:
      return ".map #tent";
    case IconsTypes.Screens:
      return ".map #screen";
    case IconsTypes.Info:
      return ".map #info";
    case IconsTypes.Cafe:
      return ".map #food";
    case IconsTypes.WC:
      return ".map #shower";
    case IconsTypes.Other:
      return ".map #tent";
    case IconsTypes.Unknown:
    default:
      return ".map #art";
  }
};
