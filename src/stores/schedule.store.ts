import { ObservableDB } from "./observableDB";
import { scheduleApi } from "../api/schedule";
import { Observable } from "cellx-decorators";

class ScheduleStore {
  @Observable
  public db = new ObservableDB<Schedule>("schedules");

  async loadSchedule(locationId: number) {
    await this.db.isLoaded;
    const schedules = await scheduleApi.getSchedules(locationId);
    this.db.addOrUpdateRange(schedules);
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

  getSchedules(
    locationId: number,
    day: Day,
    auditory: 1 | 2
  ): AuditoryElement[] {
    const auditories = this.getAuditories(locationId, day);
    if (auditories.length === 0) return [];
    if (auditories.length === 1) return auditories[0].elements;
    return auditories.find((x) => x.number === auditory).elements;
  }
}

export const scheduleStore = new ScheduleStore();
