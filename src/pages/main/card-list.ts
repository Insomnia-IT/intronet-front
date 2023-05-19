export const CardList: Array<CardInfo> = [
  {
    id: "house",
    title: "Жилье",
    color: true,
    section: Section.about,
    row: 1,
    col: 1,
  },
  {
    id: "food",
    title: "Еда",
    color: false,
    section: Section.about,
    row: 1,
    col: 2,
  },
  {
    id: "water",
    title: "Вода",
    color: false,
    section: Section.about,
    row: 1,
    col: 3,
  },

  {
    id: "phone",
    title: "Зарядить телефон",
    color: false,
    section: Section.about,
    row: 2,
    col: 1,
  },
  {
    id: "insight",
    title: "Intronet Insomnia",
    color: true,
    section: Section.about,
    row: 2,
    col: 2,
  },

  {
    id: "child",
    title: "Я с ребёнком",
    descr:
      "Где поселиться, правила безопасности, игровые площадки и активности",
    color: true,
    section: Section.about,
    row: 3,
    col: 1,
  },

  {
    id: "wc",
    title: "Туалеты и\nдуши",
    color: false,
    section: Section.about,
    row: 4,
    col: 1,
  },

  {
    id: "gc",
    title: "Мусор",
    color: false,
    section: Section.about,
    row: 4,
    col: 2,
  },

  {
    id: "animation",
    title: "Анимация",
    color: true,
    descr: "Расписание показов, все про мультфильмы в лесу",
    section: Section.activity,
    row: 1,
    col: 1,
  },

  {
    id: "music",
    title: "Музыка",
    color: false,
    section: Section.activity,
    row: 2,
    col: 1,
  },

  {
    id: "voting",
    title: "Голосование",
    color: true,
    section: Section.activity,
    row: 2,
    col: 2,
  },

  {
    id: "carnaval",
    title: "Карнавал",
    color: false,
    section: Section.activity,
    row: 3,
    col: 1,
  },

  {
    id: "friends",
    title: "Найти друзей",
    color: false,
    section: Section.activity,
    row: 3,
    col: 2,
  },

  {
    id: "nonanimation",
    title: "неАнимация",
    descr: "Дневные развлечения на фестивале",
    color: true,
    section: Section.activity,
    row: 4,
    col: 1,
  },

  {
    id: "lostChild",
    title: "Я потерял ребёнка!",
    descr: "Что делать, куда бежать, где искать...",
    color: true,
    section: Section.warning,
    row: 1,
    col: 1,
  },

  {
    id: "lostStuff",
    title: "Потерял вещи",
    color: true,
    section: Section.warning,
    row: 2,
    col: 1,
  },

  {
    id: "ants",
    title: "Клещи",
    color: false,
    section: Section.warning,
    row: 2,
    col: 1,
  },

  {
    id: "medical",
    title: "Я поранился",
    descr: "Как добраться до медиков, что делать, чтобы помочь раненому",
    color: false,
    section: Section.warning,
    row: 3,
    col: 1,
  },
  {
    id: "dogs",
    title: "Про собак",
    color: false,
    section: Section.other,
    row: 2,
    col: 1,
  },
  {
    id: "leave",
    title: "Как уехать",
    color: true,
    section: Section.other,
    row: 2,
    col: 1,
  },
];

export type CardInfo = {
  id: string;
  title: string;
  descr?: string;
  color: boolean;
  section: Section;
  row: number;
  col: number;
  colSpan?: number;
  rowSpan?: number;
};

export const enum Section {
  about,
  activity,
  warning,
  other,
}

export const Sections = [
  {
    section: Section.about,
    title: "О фестивале",
  },
  {
    section: Section.activity,
    title: "как тусим",
  },
  {
    section: Section.warning,
    title: "если чп",
  },
  {
    section: Section.other,
    title: "Тоже важное",
  },
];
