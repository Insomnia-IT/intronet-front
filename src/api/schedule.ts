import { BaseApi } from "./base";

class ScheduleApi extends BaseApi {
  getSchedules(locationId: number): Promise<Schedule[]> {
    return this.fetch<ScheduleDTO[]>("/api/Schedule/" + locationId).then(
      (items) =>
        items.map(
          (x) =>
            ({
              locationId,
              day: Days[x.day],
              id: `${locationId}.${Days[x.day]}`,
              audiences: x.audiences.map((a) => ({
                number: a.number,
                elements: a.elements.map((e) => ({
                  ...e,
                  type: "lecture",
                })),
              })),
            } as Schedule)
        )
    );
  }

  getAnimations(locationId: number): Promise<Schedule[]> {
    return this.fetch<AnimationDTO[]>("/api/Animations/all/" + locationId)
      .catch((e) => [
        {
          id: 1,
          screenId: locationId,
          day: 0,
          name: "ЦУЭ 1",
          groups: [
            {
              id: 1,
              name: "Анимация для всех",
              time: "23:45",
              ageLimit: "12 + ",
              elements: [
                {
                  id: 1,
                  name: "The Thundered Man",
                  country: "France",
                  duration: "3'58\"",
                  author: "Valentine Vendroux",
                },
                {
                  id: 2,
                  name: "Про удава Ваню",
                  country: "ru",
                  duration: "8:45",
                  author: "Ваня",
                },
                {
                  id: 3,
                  name: "Про гуся Антонину",
                  country: "ru",
                  duration: "8:45",
                  author: "Антонина",
                },
              ],
            },
          ],
        } as AnimationDTO,
      ])
      .then((items) =>
        items.map(
          (x) =>
            ({
              locationId: x.screenId,
              day: Days[x.day],
              id: `${locationId}.${Days[x.day]}`,
              audiences: [
                {
                  number: 1,
                  elements: x.groups.map((gr) => ({
                    id: gr.id,
                    type: "animation",
                    name: gr.name,
                    time: gr.time,
                    age: gr.ageLimit,
                    movies: gr.elements,
                  })),
                },
              ],
            } as Schedule)
        )
      );
  }
}

const Days: Day[] = ["Thursday", "Friday", "Saturday", "Sunday", "Monday"];

export const scheduleApi = new ScheduleApi();

type ScheduleDTO = {
  locationId: number;
  day: number;
  audiences: Auditory[];
};

type AnimationDTO = {
  id: number;
  screenId: number;
  day: number;
  name: string;
  groups: {
    id: number;
    name: string;
    time: string;
    ageLimit: string;
    elements: MovieInfo[];
  }[];
};
