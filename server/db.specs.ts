import { test } from "@jest/globals";
import locationsJSON from "./locations.json";
import moviesJSON from "./movies.json";
import { getRandomItem } from "@helpers/getRandomItem";
import { Fn } from "@cmmn/cell/lib";
import { Database } from "./database";
import { TileConverter } from "@helpers/tile.converter";

process.env.DATABASE =
  "https://admin:password@intro.cherepusick.keenetic.name/db";
const converter = new TileConverter(
  {
    x: 78306,
    y: 41656,
  },
  17,
  256
);

test("import-locations", async () => {
  const db = new Database<InsomniaLocation>("locations");
  const existed = await db.getSince();
  if (existed.length != 0) {
    return;
  }
  const data = Object.entries(locationsJSON)
    // .filter((x) => x.geometry.type == "Point")
    .flatMap(([ type, collection ], i) => {
      return collection.features.map((x) => {
        const figure: Geo | Geo[][] =
          x.geometry.type == "Point"
            ? {
              lat: x.geometry.coordinates[1] as number,
              lon: x.geometry.coordinates[0] as number,
            }
            : ((x.geometry.coordinates as number[][][]).map((arr) =>
              arr.map((x) => ({lat: x[1], lon: x[0]}))
            ) as Array<Array<Geo>>);
        return {
          _id: Fn.ulid(),
          tags: [],
          directionId: getRandomItem(directionIds),
          name: x.properties.name,
          image: "camping",
          description: x.properties.description,
          figure,
          // ...geo,
          // x: point.X,
          // y: point.Y,
        } as InsomniaLocation;
      });
    });
  for (let loc of data) {
    await db.addOrUpdate({...loc, version: Fn.ulid()});
  }
}, 600000);

test("import-movies", async () => {
  const locationsDb = new Database<InsomniaLocation>("locations");
  const locations = await locationsDb.getSince();
  if (locations.length == 0) return;
  const moviesDB = new Database<MovieBlock>("movies");
  const movies = await moviesDB.getSince();
  // console.log(movies);
  if (movies.length != 0) {
    return;
  }
  const blocks = Array.from(
    moviesJSON
      .flatMap((x) =>
        x.Blocks.map((b) => ({
          block: b,
          day: x.Day,
          locationId: locations.find((y) => y.name == x.Screen)._id,
        }))
      )
      .groupBy((x) => `${ x.block.Title }.${ x.block.SubTitle }.${ x.block.Part }`)
      .entries()
  ).map(
    ([ key, blocks ]) =>
      ({
        _id: Fn.ulid(),
        views: blocks.map((x) => ({
          day: x.day,
          start: x.block.Start,
          end: x.block.End,
          locationId: x.locationId,
        })),
        info: {
          Title: blocks[0].block.Title,
          SubTitle: blocks[0].block.SubTitle,
          TitleEn: blocks[0].block.TitleEn,
          SubTitleEn: blocks[0].block.SubTitleEn,
          MinAge: blocks[0].block.MinAge,
          Part: blocks[0].block.Part,
        },
        movies: blocks[0].block.Movies.map((x) => ({
          name: x.Name,
          description: "",
          author: x.Author,
          country: x.Country,
          year: x.Year,
          duration: x.Duration,
          id: Fn.ulid(),
        })),
      } as MovieBlock)
  );
  for (let movie of blocks) {
    await moviesDB.addOrUpdate({
      ...movie,
      version: Fn.ulid(),
    });
  }
}, 600000);
test("import-schedules", async () => {
  const locationDB = new Database<InsomniaLocation>("locations");
  const locations = await locationDB.getSince();
  const db = new Database<Schedule>("schedules");
  const schedules = await db.getSince();
  console.log(schedules, locations);
  if (schedules.length > 0) return;
  const names = [
    "Основы медитации",
    "Фестиваль Бессонница как игра...",
    "Тренировка для собак",
    "Физика и химия для детей",
    "Слушаем ГрОб",
  ];
  const descrs = [
    "Почему нам так нравится на «Бессоннице»? В чем психологический смысл переодеваний и просмотра необычных мультиков? Приглашаем вас в совместное путешествие по игровому пространству фестиваля.",
  ];
  const authors = [
    "Курмелева Анастасия. Психолог, выпускник МГУ, учёный. Основные направления — психологическое консультирование и управление персоналом",
    "Иван Максимов. Режиссёр и художник мультфильмов. Лауреат международных...",
    "Соболева Анастасия. Инструктор хатха-йоги, мастер мягких мануальных техник...",
    "Мария Суркова, специалист по поведению собак",
  ];
  for (let location of locations) {
    for (let day = 0; day < 5; day++) {
      await db.addOrUpdate({
        _id: Fn.ulid(),
        locationId: location._id,
        version: Fn.ulid(),
        day: day as Day,
        audiences: new Array(Math.floor(Math.random() * 2))
          .fill(0)
          .map((_, i) => ({
            number: i + 1,
            elements: new Array(Math.floor(Math.random() * 15)).fill(0).map(
              () =>
                ({
                  _id: Fn.ulid(),
                  name: names[Math.floor(Math.random() * names.length)],
                  description:
                    descrs[Math.floor(Math.random() * descrs.length)],
                  speaker: authors[Math.floor(Math.random() * authors.length)],
                  age: 12,
                  type: "lecture",
                  time:
                    Math.floor(Math.random() * 10 + 12) +
                    ":" +
                    Math.floor(Math.random() * 15) * 4,
                } as AuditoryElement)
            ),
          })) as any,
      });
    }
  }
}, 60000);

test("import-activities", async () => {
  const locationDB = new Database<InsomniaLocation>("locations");
  const locations = await locationDB.getSince();
  if (locations.length == 0) return;
  const db = new Database<Activity>("activities");
  const activities = await db.getSince();
  // console.log('_____', activities)
  if (activities.length > 0) return;
  const names = [
    'Основы медитации',
    'Фестиваль Бессонница как игра...',
    'Тренировка для собак',
    'Физика и химия для детей',
    'Слушаем ГрОб'
  ];
  const descrs = [
    'Почему нам так нравится на «Бессоннице»? В чем психологический смысл переодеваний и просмотра необычных мультиков? Приглашаем вас в совместное путешествие по игровому пространству фестиваля.'
  ];
  const authors = [
    'Курмелева Анастасия. Психолог, выпускник МГУ, учёный. Основные направления — психологическое консультирование и управление персоналом',
    'Иван Максимов. Режиссёр и художник мультфильмов. Лауреат международных...',
    'Соболева Анастасия. Инструктор хатха-йоги, мастер мягких мануальных техник...',
    'Мария Суркова, специалист по поведению собак'
  ]

  for (let location of locations.filter(
    (location) =>
      location.directionId === 'lectures'
      || location.directionId === 'masterClass'
      || location.directionId === 'fair'
      || location.directionId === 'playground'
  )) {
    const start = new Date();
    start.setHours(Math.floor(Math.random() * 22));
    start.setMinutes(0);
    const end = new Date();
    end.setHours(start.getHours() + 1);
    end.setMinutes(Math.floor(Math.random() * 60));

    await db.addOrUpdate({
      _id: Fn.ulid(),
      locationId: location._id,
      version: Fn.ulid(),
      day: Math.floor(Math.random() * 5) as Day,
      title: names[Math.floor(Math.random() * names.length)],
      description: descrs[Math.floor(Math.random() * descrs.length)],
      author: authors[Math.floor(Math.random() * authors.length)],
      start,
      end,
      isCanceled: !!(Math.floor(Math.random() * 5) % 2)
    })
  }
}, 60000);

const center = {
  lat: 54.68008397222222,
  lon: 35.08622484722222,
};
const centerXY = {
  x: 5512 / 2,
  y: 3892 / 2,
};

export enum Directions {
  fair = 2,
  lectures = 4,
  masterClass = 6,
  playground = 8,
  artObject = 10,
  meeting = 11,
  cafe = 12,
  tentRent = 13,
  info = 15,
  screen = 16,
  music = 20,
  staffCamp = 21,
  checkpoint = 22,
  camping = 81,
  bath = 83,
  wc = 85,
  fire = 86,
  bathhouse = 90,
  lab = 95,
}

const directionIds = Object.keys(Directions).filter((x) => Number.isNaN(+x));
