import { ObservableDB } from "./observableDB";
import { cell, Cell } from "@cmmn/cell/lib";
import { bookmarksStore } from "@stores/bookmarks.store";

class ScheduleStore {
  @cell
  public db = new ObservableDB<Schedule>("schedules");

  @cell
  public get Schedules(): Schedule[] {
    return this.db.toArray();
  }

  @cell
  public get auditories(): AuditoryElementExpand[] {
    return this.db.toArray().reduce<AuditoryElementExpand[]>((audiences, event) => {
      const currentAudiences = event.audiences.flatMap((audience) => audience.elements);

      return [ ...audiences, ...currentAudiences.map((audience) => ({
        ...audience,
        day: event.day,
        locationId: event.locationId
      })) ]
    }, []);
  }

  private getAuditories(locationId: string, day: number): Auditory[] {
    return (
      this.db
        .toArray()
        .filter((x) => x.locationId === locationId)
        .find((x) => x.day === day)?.audiences ?? []
    );
  }

  getAuditoryNumbers(locationId: string, day: number): (1 | 2)[] {
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
    day: number,
    auditory: 1 | 2
  ): AuditoryElement[] {
    const auditories = this.getAuditories(locationId, day);
    if (auditories.length === 0) return [];
    if (auditories.length === 1) return auditories[0].elements;
    const result = auditories.find((x) => x.number === auditory);
    return result?.elements || [];
  }

  getSchedule(locationId: string, day: number) {
    return this.Schedules.find(
      (x) => x.locationId === locationId && x.day === day
    );
  }
}

export const scheduleStore = new ScheduleStore();

export class EventStore {
  constructor(private id: string) {}

  @cell
  get auditory(): AuditoryElementExpand {
    return scheduleStore.auditories.find((auditory) => auditory._id === this.id);
  }

  public state = new Cell<{
    auditory: AuditoryElementExpand;
    hasBookmark: boolean;
  }>(() => ({
    auditory: this.auditory,
    hasBookmark: !!bookmarksStore.getBookmark('activity', this.auditory?._id),
  }))
}
