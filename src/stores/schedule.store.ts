import { ObservableDB } from "./observableDB";
import { scheduleApi } from "../api/schedule";
import { cell } from "@cmmn/cell/lib";
import { locationsStore } from "./locations.store";
import { Directions } from "../api/directions";
import { directionsStore } from "./directions.store";

class ScheduleStore {
  // constructor() {
  // this.loadAll();
  // setTimeout(() => this.loadAll(), 5000);
  // }

  async loadAll() {
    for (let location of locationsStore.Locations.values()) {
      await this.load(location._id);
    }
  }

  async load(locationId) {
    const location = locationsStore.Locations.get(locationId);
    if (
      directionsStore.DirectionToDirection(location.directionId) ===
      Directions.screen
    ) {
      await this.loadAnimationsSchedule(location._id);
    } else {
      await this.loadSchedule(location._id);
    }
  }

  @cell
  public db = new ObservableDB<Schedule>("schedules");

  private async loadAnimationsSchedule(locationId: string) {
    await this.db.isLoaded;
    await scheduleApi
      .getAnimations(locationId)
      .then((schedules) => this.db.addOrUpdateRange(schedules, "server"))
      .catch((err) => console.warn("Синхронизация schedules не удалась"));
  }

  private async loadSchedule(locationId: string) {
    await this.db.isLoaded;
    await scheduleApi
      .getSchedules(locationId)
      .then((schedules) => this.db.addOrUpdateRange(schedules, "server"))
      .catch((err) => console.warn("Синхронизация schedules не удалась"));
  }

  private getAuditories(locationId: string, day: Day): Auditory[] {
    return (
      this.db
        .toArray()
        .filter((x) => x.locationId === locationId)
        .find((x) => x.day === day)?.audiences ?? []
    );
  }

  getAuditorieNumbers(locationId: string, day: Day): (1 | 2)[] {
    return Array.from(
      new Set(this.getAuditories(locationId, day).map((x) => x.number))
    );
  }

  async editSchedule(schedule: Schedule) {
    try {
      const updated = await scheduleApi.editSchedule(schedule);
      this.db.addOrUpdate(updated);
    } catch (error) {
      throw error;
    }
  }

  getAuditoryElements(
    locationId: string,
    day: Day,
    auditory: 1 | 2
  ): AuditoryElement[] {
    const auditories = this.getAuditories(locationId, day);
    if (auditories.length === 0) return [];
    if (auditories.length === 1) return auditories[0].elements;
    const result = auditories.find((x) => x.number === auditory);
    return result?.elements || [];
  }

  getSchedules(): Schedule[] {
    return this.db.toArray();
  }

  getSchedule(locationId: string, day: Day) {
    return this.getSchedules().find(
      (x) => x.locationId === locationId && x.day === day
    );
  }
}

export const scheduleStore = new ScheduleStore();
