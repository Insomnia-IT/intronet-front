import { AdminApi } from "./admin";
import { locationsStore } from "../stores/locations.store";

class ScheduleApi extends AdminApi {
  getSchedules(locationId: number): Promise<Schedule[]> {
    return this.fetch<ScheduleDTO[]>("/api/Schedule/" + locationId).then(
      (items) => items.map((x) => this.readScheduleDTO(x, locationId))
    );
  }

  private readScheduleDTO(x: ScheduleDTO, locationId: number): Schedule {
    return {
      locationId,
      day: Days[x.day],
      id: x.id,
      audiences: x.audiences.map((a) => ({
        ...a,
        elements: a.elements.map((e) => ({
          ...e,
          type: "lecture",
        })),
      })),
    } as Schedule;
  }

  async getAllAnimations(): Promise<Schedule[]> {
    const cartoons = await this.fetch<any[]>("/api/Cartoons/schedule");
    return cartoons.map((x) => ({
      locationId: locationsStore.FullLocations.find((l) => l.name === x.screen)
        .id,
      id: `${x.screen}.${x.day}`,
      day: Days[x.day],
      audiences: [
        {
          number: 1,
          elements: x.blocks.map((b) => ({
            id: b.title + b.part,
            type: "animation",
            changes: null,
            isCanceled: false,
            speaker: "",
            movies: b.movies,
            age: b.minAge,
            name: b.part ? `${b.title} #${b.part}` : b.title,
            time: b.start,
            description: b.subtitle,
          })),
        },
      ],
    }));
  }

  getAnimations(locationId: number): Promise<Schedule[]> {
    return this.fetch<AnimationDTO[]>("/api/Cartoons/" + locationId).then(
      (items) =>
        items.map(
          (x) =>
            ({
              locationId: x.locationId,
              day: Days[x.day],
              id: `${x.locationId}.${x.day}`,
              audiences: [
                {
                  number: 1,
                  elements: x.blocks.map((b) => ({
                    id: b.title + b.part,
                    type: "animation",
                    changes: null,
                    isCanceled: false,
                    speaker: "",
                    description: b.subTitle,
                    name: b.part ? `${b.title} #${b.part}` : b.title,
                    time: b.start,
                    age: b.minAge,
                    movies: b.movies,
                  })),
                },
              ],
            } as Schedule)
        )
    );
  }

  async editSchedule(schedule: Schedule) {
    try {
      const res = await this.adminFetch(
        "/api/Admin/locations/schedule/add-or-edit",
        {
          body: JSON.stringify({
            ...schedule,
            day: Days.indexOf(schedule.day),
          }),
          method: "POST",
        }
      );
      return this.readScheduleDTO(res, schedule.locationId);
    } catch (error) {
      throw error;
    }
  }
}

const Days: Day[] = ["Thursday", "Friday", "Saturday", "Sunday", "Monday"];

export const scheduleApi = new ScheduleApi();

type ScheduleDTO = {
  locationId: number;
  id: number;
  day: number;
  audiences: Auditory[];
};

type AnimationDTO = {
  locationId: number;
  day: number;
  screen: string;
  blocks: {
    title: string;
    subTitle: string;
    start: string;
    end: string;
    minAge: number;
    part: number;
    movies: MovieInfo[];
  }[];
};
