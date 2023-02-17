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
  directionId: number;
  x: number;
  y: number;
  lat: number;
  lon: number;
  tags: number[];
  image: string;
  menu?: string;
};

type MapItem = {
  point: { X; Y };
  icon: JSX.Element;
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

interface INote {
  id: number;
  title: string;
  text: string;
  categoryId: number;
  createdDate: string;
  createdBy: "admin" | null;
}

interface ICategory {
  id: number; // Id категории
  name: string; //название категории
  count: number; //количество элементов которым присвоена данная категория
  color: string; // Цвет категории, для раскрашивания её карточки
}

type Day = "Thursday" | "Friday" | "Saturday" | "Sunday" | "Monday";

interface Schedule {
  id: number | string;
  locationId: number;
  day: Day;
  audiences: Auditory[];
}

interface Auditory {
  number: 1 | 2;
  elements: AuditoryElement[];
}
interface AuditoryElement {
  id: number | string;
  type: "animation" | "lecture";
  name: string; //Название пункта расписания.
  description?: string; //Описание мастер-класса или лекции. (ЕСЛИ ЧЕСТНО, БУДЕТ РЕДКО КЕМ НАПИСАНО. Возможно, суну сюда генерируемое что-нить аля доп поля)
  time: string; //Время начала.
  speaker?: string; //Лектор или ведущий мастер класса, или учёный, или вообще кто угодно.
  isCanceled?: bool; //Если = true, значит отменено.
  changes?: string; //Изменения в расписании по данному пункту.
  age?: number;
  movies?: MovieInfo[];
}

type MovieInfo = {
  name: string;
  country: string;
  year;
  duration: string;
  author: string;
};

type Direction = {
  id: number;
  name: string;
  image: string;
};
interface IArticle {
  id: number;
  title: string;
  text: string;
}

type TMainPageCard = {
  id: string;
  title: string;
  img: string;
  link: string[];
};

type User = {
  ticketId: string;
  token: string;
};
