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
}

export const scheduleStore = new ScheduleStore();
