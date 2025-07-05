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

type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };

type InsomniaLocation = {
  _id: string;
  // Неуникальный, но постоянный
  notionId: string;
  mapName: string;
  name: string;
  description: string;
  directionId: string;
  figure: GeoFigure;
  tags: string[];
  work_tags: string[];
  menu?: string;
  priority: boolean;
  minZoom?: number;
  maxZoom?: number;
  contentBlocks?: ContentBlock[];
  isFoodcourt: boolean;
};

type ContentBlock =
  | {
      blockType: "text";
      content: string;
    }
  | {
      blockType: "link";
      title: string;
      link: string;
    };

type ListItem = {
  tag?: string;
  title: string;
  description: string;
};

type Geo = { lat: number; lon: number };
type Point = { X: number; Y: number };
type GeoFigure = Geo | Array<Geo> | Array<Array<Geo>>;
type Figure = Point | Array<Point> | Array<Array<Point>>;

type MapItem = {
  figure: Figure;
  priority: boolean;
  directionId: string;
  radius;
  id;
  title?: string;
  minZoom?: number;
  maxZoom?: number;
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

type INoteLocal = {
  title: string;
  text: string;
  categoryId: string;
  author: {
    name: string;
  };
  TTL: 13 | 14 | 15 | 16 | 17 | 18;
  isPinned: boolean;
};

type INote = INoteLocal & {
  _id: string;
  author: {
    name: string;
    id: string;
  };
  isApproved: boolean;
  createdAt: number;
  updatedAt?: number;
  isDeleted?: boolean;
  deletedAt?: number;
};

type INoteUpdated = Partial<
  Pick<
    INote,
    | "title"
    | "text"
    | "categoryId"
    | "TTL"
    | "isApproved"
    | "isDeleted"
    | "restricted"
  >
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
  start: string;
  end: string;
  authors: Array<{
    name: string;
    description?: string;
    photo?: string;
  }>;
  age?: number;
  hasChanges?: boolean;
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
  isCanceled?: boolean; //Если = true, значит отменено.
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
  plot?: string;
  image?: string;
  country: string;
  author: string;
  vurchelId: string;
  info?: VurchelFilm;
};

interface VurchelFilm {
  _id: string;
  entryID: number;
  link: string;
  filmEnTitle: string;
  filmOrigTitle: string | null;
  filmDuration: string | null;
  filmEnPlot: string;
  filmTrailer: string | null;
  filmFull: string | null;
  filmReleaseYear: string | null;
  countries: string[];
  images: string[];
  translations: Translation[];
  credits: Credits[];
}

interface Translation {
  language: string;
  translatedTitle: string;
  translatedPlot: string;
}

interface Credits {
  directors: Filmmaker[];
}

interface Filmmaker {
  name: string;
  photo: string | null;
  link: string;
}

type Direction = {
  _id: string;
  name: string;
  image: string;
};
interface IShop {
  _id: string;
  name: string;
  description: string;
  links: string;
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
type MainPageSection = "main" | "about" | "warning";

type MainPageCard = {
  _id: string;
  title: string;
  descr?: string;
  color: boolean;
  section: MainPageSection;
  row: number;
  col: number;
  small?: boolean;
  colSpan?: number;
  rowSpan?: number;
  article?: string;
  link?: string;
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
};

type Change = {
  _id: string;
  day?: number;
  start?: string;
  end?: string;
} & Record<string, any>;

declare const PRODUCTION: boolean;
