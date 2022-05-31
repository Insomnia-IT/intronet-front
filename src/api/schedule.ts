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
              id: `${x.locationId}.${x.day}`,
            } as Schedule)
        )
      );
  }
}

export const scheduleApi = new ScheduleApi();

type ScheduleDTO = {
  locationId: number;
  day: Day;
  auditoryElements: Auditory[];
};

const mockSchedules: ScheduleDTO[] = [
  {
    locationId: 1,
    day: "Thursday",
    auditoryElements: [
      {
        Number: 1,
        Elements: [
          {
            Name: "«Боксбалет»",
            Time: "22:22",
            Description: "Описание мультфильма",
            Changes: "",
            IsCanceled: false,
            Speaker: "",
          },
          {
            Name: "«Самолёт»",
            Time: "23:22",
            Description: "Описание мультфильма",
            Changes: "Время изменилось",
            IsCanceled: true,
            Speaker: "",
          },
          {
            Name: "«Смешарики»",
            Time: "01:22",
            Description: "Описание мультфильма",
            Changes: "",
            IsCanceled: false,
            Speaker: "",
          },
        ],
      },
    ],
  },
  {
    locationId: 1,
    day: "Friday",
    auditoryElements: [
      {
        Number: 1,
        Elements: [
          {
            Name: "«Боксбалет»",
            Time: "22:22",
            Description: "Описание мультфильма",
            Changes: "",
            IsCanceled: false,
            Speaker: "",
          },
          {
            Name: "«Самолёт»",
            Time: "23:22",
            Description: "Описание мультфильма",
            Changes: "Время изменилось",
            IsCanceled: true,
            Speaker: "",
          },
          {
            Name: "«Смешарики»",
            Time: "01:22",
            Description: "Описание мультфильма",
            Changes: "",
            IsCanceled: false,
            Speaker: "",
          },
        ],
      },
      {
        Number: 2,
        Elements: [
          {
            Name: "«Боксбалет»",
            Time: "23:22",
            Description: "Описание мультфильма",
            Changes: "",
            IsCanceled: true,
            Speaker: "",
          },
          {
            Name: "«Самолёт»",
            Time: "00:22",
            Description: "Описание мультфильма",
            Changes: "",
            IsCanceled: false,
            Speaker: "",
          },
          {
            Name: "«Смешарики»",
            Time: "02:22",
            Description: "Описание мультфильма",
            Changes: "",
            IsCanceled: false,
            Speaker: "",
          },
        ],
      },
    ],
  },
];
