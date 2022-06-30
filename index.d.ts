declare module "*.less" {
  const style: { [key: string]: string };
  export default style;
}

declare module "*.css" {
  const style: { [key: string]: string };
  export = style;
}

declare module "*.svg" {
  const style: string;
  export default style;
}

declare module "*.png" {
  const style: string;
  export default style;
}

declare module "*.module.css" {
  const style: any;
  export default style;
}

declare module "*.module.scss" {
  const style: any;
  export default style;
}

declare module "*.module.sass" {
  const style: any;
  export default style;
}

declare module "*.html" {
  const style: string;
  export default style;
}

type InsomniaLocation = {
  id: number;
  name: string;
  description: string;
  x: number;
  y: number;
  lat: number;
  lng: number;
  tags: number[];
  image: string;
};

type MapItem = {
  point: { X; Y };
  icon;
  radius;
  id;
  title?: string;
};

type InsomniaLocationFull = Omit<InsomniaLocation, "tags"> & {
  tags: Tag[];
};

type Tag = {
  id: number;
  name: string;
};

type Movie = {
  id: number | string;
  title: string;
  start: Date;
  end: Date;
  author: string;
};

interface INotes {
  id: number;
  title: string;
  text: string;
  categoryId: number;
}

interface ICategory {
  id: number; // Id категории
  name: string; //название категории
  count: number; //количество элементов которым присвоена данная категория
  color: string; // Цвет категории, для раскрашивания её карточки
}

type Day = "Thursday" | "Friday" | "Saturday" | "Sunday";

interface Schedule {
  id: string;
  locationId: number;
  day: Day;
  auditoryElements: Auditory[];
}

interface Auditory {
  Number: 1 | 2;
  Elements: AuditoryElement[];
}
interface AuditoryElement {
  Name: string; //Название пункта расписания.
  Description: string; //Описание мастер-класса или лекции. (ЕСЛИ ЧЕСТНО, БУДЕТ РЕДКО КЕМ НАПИСАНО. Возможно, суну сюда генерируемое что-нить аля доп поля)
  Time: string; //Время начала.
  Speaker: string; //Лектор или ведущий мастер класса, или учёный, или вообще кто угодно.
  IsCanceled: bool; //Если = true, значит отменено.
  Changes: string; //Изменения в расписании по данному пункту.
}

interface IArticle {
  id: number;
  title: string;
  text: string;
}

type TMainPageCard = {
  id: string;
  title: string;
  img: string;
  link: string;
};
