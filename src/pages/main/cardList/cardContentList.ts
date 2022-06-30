import { generateId } from "src/helpers/generateId";

export const cardContentList: TMainPageCard[] = [
  {
    title: "Правила фестиваля",
    img: process.env.PUBLIC_URL + "/images/insomnia_intro_1.webp",
    link: "/articles/1",
  },
  {
    title: "История фестиваля",
    img: process.env.PUBLIC_URL + "/images/insomnia_intro_2.webp",
    link: "/articles/2",
  },
  {
    title: "Техника безопасности",
    img: process.env.PUBLIC_URL + "/images/insomnia_intro_3.webp",
    link: "/articles/3",
  },
  {
    title: "FAQ",
    img: process.env.PUBLIC_URL + "/images/insomnia_intro_4.webp",
    link: "/articles/4",
  },
  {
    title: "Расписание транспорта от фестиваля",
    img: process.env.PUBLIC_URL + "/images/insomnia_intro_5.webp",
    link: "/articles",
  },
].map(generateId);
