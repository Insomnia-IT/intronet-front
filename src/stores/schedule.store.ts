import { ObservableDB } from "./observableDB";
import { scheduleApi } from "../api/schedule";
import { Observable } from "cellx-decorators";
import { locationsStore } from "./locations.store";

class ScheduleStore {
  constructor() {
    this.loadAll();
    setTimeout(() => this.loadAll(), 5000);
  }

  async loadAll() {
    for (let location of locationsStore.Locations.values()) {
      if (location.directionId === 2) {
        this.loadAnimationsSchedule(location.id);
      } else {
        this.loadSchedule(location.id);
      }
    }
  }

  @Observable
  public db = new ObservableDB<Schedule>("schedules");

  private async loadAnimationsSchedule(locationId: number) {
    await this.db.isLoaded;
    await scheduleApi
      .getAnimations(locationId)
      .then((schedules) => this.db.addOrUpdateRange(schedules, "server"))
      .catch((err) => console.warn("Синхронизация schedules не удалась"));
  }
  private async loadSchedule(locationId: number) {
    await this.db.isLoaded;
    await scheduleApi
      .getSchedules(locationId)
      .then((schedules) => this.db.addOrUpdateRange(schedules, "server"))
      .catch((err) => console.warn("Синхронизация schedules не удалась"));
  }

  private getAuditories(locationId: number, day: Day): Auditory[] {
    return (
      this.db
        .toArray()
        .filter((x) => x.locationId === locationId)
        .find((x) => x.day === day)?.audiences ?? []
    );
  }

  getAuditorieNumbers(locationId: number, day: Day): (1 | 2)[] {
    return Array.from(
      new Set(this.getAuditories(locationId, day).map((x) => x.number))
    );
  }

  async editSchedule(schedule: Schedule) {
    try {
      await scheduleApi.editSchedule(schedule);
      this.db.addOrUpdate(schedule);
    } catch (error) {
      throw error;
    }
  }

  getAuditoryElements(
    locationId: number,
    day: Day,
    auditory: 1 | 2
  ): AuditoryElement[] {
    const auditories = this.getAuditories(locationId, day);
    if (auditories.length === 0) return [];
    const result = auditories.find((x) => x.number === auditory);
    return result?.elements || [];
  }

  getSchedules(): Schedule[] {
    return this.db.toArray();
  }
}

export const scheduleStore = new ScheduleStore();
