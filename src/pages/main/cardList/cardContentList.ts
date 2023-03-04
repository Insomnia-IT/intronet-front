import {Fn} from "@cmmn/cell/lib";

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
    _id: Fn.ulid(),
    title: "Техника безопасности",
    img:"/images/insomnia_intro_3.webp",
    link: ['article', '3'],
  },
  {
    _id: Fn.ulid(),
    title: "FAQ",
    img: "/images/insomnia_intro_4.webp",
    link: ['article', '4'],
  },
  {
    _id: Fn.ulid(),
    title: "Расписание транспорта от фестиваля",
    img:  "/images/insomnia_intro_5.webp",
    link: ['article', '5'],
  },
];
