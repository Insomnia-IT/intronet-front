import { Observable } from "cellx-decorators";
import React from "react";
import { cellState } from "../../../helpers/cell-state";
import { locationsStore } from "../../../stores/locations.store";
import { scheduleStore } from "../../../stores/schedule.store";
import { LocationSchedule } from "./LocationSchedule";
import { LocationScheduleProps } from "./types";
import { DAYS } from "../../../constants";

export class ConnectedLocationSchedule extends React.PureComponent<
  Pick<
    LocationScheduleProps,
    "renderScheduleInfo" | "renderScheduleFooter" | "locationId"
  >
> {
  @Observable
  locationId: number;
  @Observable
  auditory: 1 | 2 = 1;
  @Observable
  day: Day = DAYS[new Date().getDate() - 14];
  @Observable
  selectedElement: AuditoryElement;

  state = cellState(this, {
    auditoryElements: () =>
      scheduleStore.getAuditoryElements(
        this.locationId,
        this.day,
        this.auditory
      ),
    auditories: () =>
      scheduleStore.getAuditorieNumbers(this.locationId, this.day),
    auditory: () => this.auditory,
    day: () => this.day,
    selectedElement: () => this.selectedElement,
    schedules: () => scheduleStore.getSchedules(),
    menu: () => locationsStore.Locations.get(this.locationId)?.menu,
  });

  render() {
    return (
      <LocationSchedule
        {...this.state}
        {...this.props}
        onDayChange={(day) => (this.day = day)}
        onAuditoryChange={(auditory) => (this.auditory = auditory)}
        onSelectedElementChange={(selectedElement) =>
          (this.selectedElement = selectedElement)
        }
      />
    );
  }

  componentDidUpdate(
    prevProps: Readonly<LocationScheduleProps>,
    prevState: Readonly<{}>,
    snapshot?: any
  ) {
    if (this.locationId !== this.props.locationId) {
      this.locationId = this.props.locationId;
      scheduleStore.load(this.locationId);
    }
  }
}
