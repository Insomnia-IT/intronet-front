import { Cell, cell } from "@cmmn/cell";
import { getDayText } from "../../helpers/getDayText";
import { ActivityFilterType } from "../../pages/activities/hooks/useActivitiesRouter";

export interface IActivityFilter {
  key: string | number | ActivityFilterType;
  value: string;
}

class ActivityFiltersStore {
  @cell
  get filters(): IActivityFilter[] {
    return [
      { key: "time", value: "По времени" },
      { key: "place", value: "По площадке" },
    ];
  }

  @cell
  get times(): IActivityFilter[] {
    return [
      { key: 8, value: "8:00-13:00" },
      { key: 13, value: "13:00-17:00" },
      { key: 17, value: "17:00-8:00" },
    ];
  }

  @cell
  get days(): IActivityFilter[] {
    return [0, 1, 2, 3, 4].map((item) => ({
      key: item,
      value: getDayText(item, "short").toUpperCase(),
    }));
  }
}

export const activityFiltersStore = new ActivityFiltersStore();
