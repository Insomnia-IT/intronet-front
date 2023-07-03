type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] }

type InsomniaLocation = {
  _id: string;
  // Неуникальный, но постоянный
  notionId: string;
  name: string;
  description: string;
  directionId: string;
  figure: Geo | Geo[][];
  tags: string[];
  menu?: string;
  minZoom?: number;
  maxZoom?: number;
  contentBlocks?: ContentBlock[];
};

type ContentBlock = {
  blockType: 'link' | 'text';
  content: string | ListItem[];
}

type ListItem = {
  tag?: string;
  title: string;
  description: string;
}

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
  TTL: 13 | 14 | 15 | 16 | 17;
  // on moderation
  restricted?: boolean;
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
  Pick<INote, "title" | "text" | "categoryId" | "TTL" | "isApproved" | "isDeleted">
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
  author: string;
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
  description: string;
  country: string;
  year;
  image: string;
  duration: string;
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
}

type Change = {
  _id: string;
  day?: number;
  start?: string;
  end?: string;
} & Record<string, any>;
