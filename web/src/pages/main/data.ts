export interface MainPageSection {
  id: string;
  title: string;
  rows: MainPageCard[][]
}

export interface MainPageCard {
  id: string;
  title: string;
  article?: string;
  color?: boolean;
  descr?: string;
  size?: MainPageCardSize;
  link?: string;
}

export type MainPageCardSize = "small" | "medium" | "large";

export const mainPageData: MainPageSection[] = [
  {
    id: "infrastructure",
    title: "Инфраструктура",
    rows: [
      [
        {
          id: "food",
          title: "Еда",
          color: true,
          article: "food"
        },
        {
          id: "water",
          title: "Вода",
          article: "water"
        },
        {
          id: "wc",
          title: "Туалеты и\nдуши"
        }
      ],
      [
        {
          id: "medical",
          title: "Мед. пункт",
          descr: "Как добраться до медиков, что делать, чтобы помочь раненому",
          size: "large"
        }
      ],
      [
        {
          id: "phone",
          title: "Зарядить телефон",
          article: "phone"
        },
        {
          id: "house",
          title: "Жилье",
          color: true,
          article: "living"
        }
      ],
      [
        {
          id: "tochka",
          title: "Точка Сборки",
          descr: "Если вы потеряли ребёнка, друга, телефон или смысл жизни — тут помогут",
          color: true,
          size: "large"
        }
      ]
    ]
  },
  {
    id: "activities",
    title: "Активности",
    rows: [
      [
        {
          id: "theatre",
          title: "Театр",
          size: "small"
        },
        {
          id: "music",
          title: "Музыка",
          color: true,
          size: "small"
        }
      ],
      [
        {
          id: "carnaval",
          title: "Карнавал",
          size: "small"
        },
        {
          id: "art",
          title: "Арт",
          size: "small"
        }
      ],
      [
        {
          id: "game",
          title: "Игра",
          color: true,
          size: "small"
        },
        {
          id: "radio",
          title: "Радио",
          color: true,
          size: "small",
          article: "radio"
        }
      ],
      [
        {
          id: "vote",
          title: "Голосование",
          descr: "Выберите лучший мультфильм и отдайте свой голос",
          "link": "/voting",
          size: "large"
        }
      ]
    ]
  },
  {
    id: "useful",
    title: "Полезно знать",
    rows: [
      [
        {
          id: "child",
          title: "Я с ребёнком",
          color: true
        },
        {
          id: "dogs",
          title: "Про собак",
          color: true
        },
        {
          id: "ants",
          title: "Про клещей"
        }
      ],
      [
        {
          id: "eco",
          title: "Мусор и\nэкология"
        },
        {
          id: "about",
          title: "О фестивале",
          color: true
        }
      ],
      [
        {
          id: "leave",
          title: "Как уехать",
          color: true
        },
        {
          id: "carFailure",
          title: "Моя машина застряла!"
        }
      ],
      [
        {
          id: "insight",
          title: "О портале Insight",
          color: true,
          size: "small"
        }
      ]
    ]
  }
]
