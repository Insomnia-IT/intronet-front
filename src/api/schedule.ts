import { BaseApi } from "./base";
class ScheduleApi extends BaseApi {
  getSchedules(locationId: number): Promise<Schedule[]> {
    return this.fetch<ScheduleDTO[]>("/api/Schedule/" + locationId)
      .catch((e) => mockSchedules)
      .then((items) =>
        items.map(
          (x) =>
            ({
              ...x,
              locationId,
              day: Days[x.day],
              id: `${locationId}.${Days[x.day]}`,
            } as Schedule)
        )
      );
  }
}
const Days: Day[] = ["Thursday", "Friday", "Saturday", "Sunday", "Monday"];

export const scheduleApi = new ScheduleApi();

type ScheduleDTO = {
  locationId: number;
  day: Day;
  audiences: Auditory[];
};

const mockSchedules: ScheduleDTO[] = [
  {
    locationId: 1,
    day: "Thursday",
    audiences: [
      {
        number: 1,
        elements: [
          {
            id: 3,
            name: "«Боксбалет»",
            time: "22:22",
            description: "Описание мультфильма",
            changes: "",
            isCanceled: false,
            speaker: "Сидоров",
          },
          {
            id: 3,
            name: "«Самолёт»",
            time: "23:22",
            description: "Описание мультфильма",
            changes: "Время изменилось",
            isCanceled: true,
            speaker: "Иванов",
          },
          {
            id: 3,
            name: "«Смешарики»",
            time: "01:22",
            description: "Описание мультфильма",
            changes: "",
            isCanceled: false,
            speaker: "Петров",
          },
        ],
      },
    ],
  },
  {
    locationId: 1,
    day: "Friday",
    audiences: [
      {
        number: 1,
        elements: [
          {
            id: 3,
            name: "«Боксбалет»",
            time: "22:22",
            description: "Описание мультфильма",
            changes: "",
            isCanceled: false,
            speaker: "Сидоров",
          },
          {
            id: 3,
            name: "«Самолёт»",
            time: "23:22",
            description: "Описание мультфильма",
            changes: "Время изменилось",
            isCanceled: true,
            speaker: "Иванов",
          },
          {
            id: 3,
            name: "«Смешарики»",
            time: "01:22",
            description: "Описание мультфильма",
            changes: "",
            isCanceled: false,
            speaker: "Петров",
          },
        ],
      },
      {
        number: 2,
        elements: [
          {
            id: 3,
            name: "«Боксбалет»",
            time: "23:22",
            description: "Описание мультфильма",
            changes: "",
            isCanceled: true,
            speaker: "Иванов",
          },
          {
            id: 3,
            name: "«Самолёт»",
            time: "00:22",
            description: "Описание мультфильма",
            changes: "",
            isCanceled: false,
            speaker: "Петров",
          },
          {
            id: 3,
            name: "«Смешарики»",
            time: "02:22",
            description: "Описание мультфильма",
            changes: "",
            isCanceled: false,
            speaker: "Иванов",
          },
        ],
      },
    ],
  },
];
