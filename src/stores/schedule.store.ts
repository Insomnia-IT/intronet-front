import { ObservableDB } from "./observableDB";
import { cell } from "@cmmn/cell/lib";

class ScheduleStore {

  @cell
  public db = new ObservableDB<Schedule>("schedules");

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
      this.db.addOrUpdate(schedule);
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
