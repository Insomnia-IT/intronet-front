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
  figure: Geo | Geo[][];
  tags: string[];
  image: string;
  menu?: string;
  minZoom?: number;
  maxZoom?: number;
};

type Geo = { lat: number; lon: number };
type Point = { X: number; Y: number };
type GeoFigure = Geo | Array<Array<Geo>>;
type Figure = Point | Array<Array<Point>>;

type MapItem = {
  figure: Figure;
  directionId: string;
  radius;
  id;
  title?: string;
  minZoom?: number;
  maxZoom?: number;
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

type INote = {
  _id: string;
  title: string;
  text: string;
  categoryId: string;
  author: string;
  createdAt: number;
  updatedAt?: number;
};

type INoteLocal = Omit<INote, "_id" | "createdAt" | "updatedAt">;

type INoteUpdated = Partial<
  Omit<INote, "createdAt" | "updatedAt" | "author" | "_id">
>;

type ICategory = {
  _id: string; // Id категории
  name: string; // название категории
  color: string; // Цвет категории, для раскрашивания её карточки
};

type ICategoryLocal = Omit<ICategory, "_id">;

type Day = 0 | 1 | 2 | 3 | 4; // Четверг, Пятница, Суббота, Вс, Пн

interface Activity {
  _id: string;
  locationId: string;
  title: string;
  description: string;
  day: number;
  start: Date | string;
  end: Date;
  author: string;
  age?: number;
  changes?: string;
  isCanceled?: boolean;
}

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

interface AuditoryElementExpand extends AuditoryElement {
  locationId: string;
  day: number;
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

type BookmarkSection = "movie" | "activity" | "locations" | "note";
type MainPageSection = "about" | "activity" | "warning" | "other";

type MainPageCard = {
  _id: string;
  title: string;
  descr?: string;
  color: boolean;
  section: MainPageSection;
  row: number;
  col: number;
  colSpan?: number;
  rowSpan?: number;
};

/**
 * Новости добавляемые админами на главную страницу
 */
type NewsItem = {
  _id: string;
  title: string;
  text: string;
  link: string | undefined;
  linkText: string | undefined;
  time: string;
}
