export const CardList: Array<MainPageCard> = [
  {
    _id: "house",
    title: "Жилье",
    color: true,
    section: 'about',
    row: 1,
    col: 1,
  },
  {
    _id: "food",
    title: "Еда",
    color: false,
    section: 'about',
    row: 1,
    col: 2,
  },
  {
    _id: "water",
    title: "Вода",
    color: false,
    section: 'about',
    row: 1,
    col: 3,
  },

  {
    _id: "phone",
    title: "Зарядить телефон",
    color: false,
    section: 'about',
    row: 2,
    col: 1,
  },
  {
    _id: "insight",
    title: "Intronet Insomnia",
    color: true,
    section: 'about',
    row: 2,
    col: 2,
  },

  {
    _id: "child",
    title: "Я с ребёнком",
    descr:
      "Где поселиться, правила безопасности, игровые площадки и активности",
    color: true,
    section: 'about',
    row: 3,
    col: 1,
  },

  {
    _id: "wc",
    title: "Туалеты и\nдуши",
    color: false,
    section: 'about',
    row: 4,
    col: 1,
  },

  {
    _id: "gc",
    title: "Мусор",
    color: false,
    section: 'about',
    row: 4,
    col: 2,
  },

  {
    _id: "animation",
    title: "Анимация",
    color: true,
    descr: "Расписание показов, все про мультфильмы в лесу",
    section: 'activity',
    row: 1,
    col: 1,
  },

  {
    _id: "music",
    title: "Музыка",
    color: false,
    section: 'activity',
    row: 2,
    col: 1,
  },

  {
    _id: "voting",
    title: "Голосование",
    color: true,
    section: 'activity',
    row: 2,
    col: 2,
  },

  {
    _id: "carnaval",
    title: "Карнавал",
    color: false,
    section: 'activity',
    row: 3,
    col: 1,
  },

  {
    _id: "friends",
    title: "Найти друзей",
    color: false,
    section: 'activity',
    row: 3,
    col: 2,
  },

  {
    _id: "nonanimation",
    title: "неАнимация",
    descr: "Дневные развлечения на фестивале",
    color: true,
    section: 'activity',
    row: 4,
    col: 1,
  },

  {
    _id: "lostChild",
    title: "Я потерял ребёнка!",
    descr: "Что делать, куда бежать, где искать...",
    color: true,
    section: 'warning',
    row: 1,
    col: 1,
  },

  {
    _id: "lostStuff",
    title: "Потерял вещи",
    color: true,
    section: 'warning',
    row: 2,
    col: 1,
  },

  {
    _id: "ants",
    title: "Клещи",
    color: false,
    section: 'warning',
    row: 2,
    col: 1,
  },

  {
    _id: "medical",
    title: "Я поранился",
    descr: "Как добраться до медиков, что делать, чтобы помочь раненому",
    color: false,
    section: 'warning',
    row: 3,
    col: 1,
  },
  {
    _id: "dogs",
    title: "Про собак",
    color: false,
    section: 'other',
    row: 2,
    col: 1,
  },
  {
    _id: "leave",
    title: "Как уехать",
    color: true,
    section: 'other',
    row: 2,
    col: 1,
  },
];




const enum Section {
  about,
  activity,
  warning,
  other,
}
