import { generateId } from "src/helpers/generateId";

export const cardContentList: TMainPageCard[] = [
  // {
  //   title: "Правила фестиваля",
  //   img: process.env.PUBLIC_URL + "/images/insomnia_intro_1.webp",
  //   link: "/article/1",
  // },
  // {
  //   title: "История фестиваля",
  //   img: process.env.PUBLIC_URL + "/images/insomnia_intro_2.webp",
  //   link: "/article/2",
  // },
  {
    title: "Техника безопасности",
    img: process.env.PUBLIC_URL + "/images/insomnia_intro_3.webp",
    link: ['article', '3'],
  },
  {
    title: "FAQ",
    img: process.env.PUBLIC_URL + "/images/insomnia_intro_4.webp",
    link: ['article', '4'],
  },
  {
    title: "Расписание транспорта от фестиваля",
    img: process.env.PUBLIC_URL + "/images/insomnia_intro_5.webp",
    link: ['article', '5'],
  },
].map(generateId);
