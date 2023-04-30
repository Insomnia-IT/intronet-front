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
  _id: string;
  name: string;
  description: string;
  directionId: string;
  x: number;
  y: number;
  lat: number;
  lon: number;
  tags: string[];
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
  _id: string;
  name: string;
};

type Movie = {
  _id: string;
  title: string;
  start: Date;
  end: Date;
  author: string;
};

type MovieBlock = {
  _id: string;
  views: {
    day: number;
    locationId: string;
    start: string;
    end: string;
  }[];

  info: {
    Title: string;
    SubTitle: string;
    TitleEn: string;
    SubTitleEn: string;
    MinAge: number;
    Part: number;
  };
  movies: MovieInfo[];
};

interface INote {
  _id: string;
  title: string;
  text: string;
  categoryId: string;
  createdDate: string;
  createdBy: "admin" | null;
}

interface ICategory {
  _id: string; // Id категории
  name: string; //название категории
  count: number; //количество элементов которым присвоена данная категория
  color: string; // Цвет категории, для раскрашивания её карточки
}

type Day = "Thursday" | "Friday" | "Saturday" | "Sunday" | "Monday";

interface Schedule {
  _id: string;
  locationId: string;
  day: Day;
  audiences: Auditory[];
}

interface Auditory {
  number: 1 | 2;
  elements: AuditoryElement[];
}
interface AuditoryElement {
  _id: string;
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
  id: string;
  name: string;
  description: string;
  country: string;
  year;
  duration: string;
  author: string;
};

type Direction = {
  _id: string;
  name: string;
  image: string;
};
interface IArticle {
  _id: string;
  title: string;
  text: string;
}

type TMainPageCard = {
  _id: string;
  title: string;
  img: string;
  link: string[];
};

type User = {
  ticketId: string;
  token: string;
};

type Bookmark = {
  _id: string;
  type: BookmarkSection;
  itemId: string;
};
type BookmarkSection = "movie" | "activity" | "bayka";
