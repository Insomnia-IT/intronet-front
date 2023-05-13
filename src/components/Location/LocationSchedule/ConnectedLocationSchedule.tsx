import { cell } from "@cmmn/cell/lib";
import {getCurrentDay} from "@helpers/getDayText";
import {Component} from "preact";
import { cellState } from "@helpers/cell-state";
import { locationsStore, scheduleStore } from "@stores";
import { LocationSchedule } from "./LocationSchedule";
import { LocationScheduleProps } from "./types";
import { DAYS } from "@constants";

export class ConnectedLocationSchedule extends Component<Pick<
  LocationScheduleProps,
  "renderScheduleInfo" | "renderScheduleFooter" | "locationId"
> > {
  @cell
  locationId: string;
  @cell
  auditory: 1 | 2 = 1;
  @cell
  day: Day = getCurrentDay();
  @cell
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
    menu: () => locationsStore.db.get(this.locationId)?.menu,
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
    }
  }
}
