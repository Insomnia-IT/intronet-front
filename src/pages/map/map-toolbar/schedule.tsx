import React from "react";
import { scheduleStore } from "../../../stores/schedule.store";
import { Computed, Observable } from "cellx-decorators";
import { cellState } from "../../../helpers/cell-state";
import { HStack } from "@chakra-ui/react";
import styles from "./schedule.module.css";
import { Chip } from "src/components/chip/chip";
import { ChevronUpIcon } from "@chakra-ui/icons";

export class ScheduleComponent extends React.PureComponent<ScheduleProps> {
  @Observable
  locationId: number;
  @Observable
  auditory: 1 | 2 = 1;
  @Observable
  day: Day = "Thursday";
  @Observable
  selectedElement: AuditoryElement;

  @Computed
  get Auditories() {
    return (
      scheduleStore.db
        .toArray()
        .filter((x) => x.locationId == this.locationId)
        .find((x) => x.day == this.day)?.auditoryElements ?? []
    );
  }

  @Computed
  get Schedules() {
    return (
      this.Auditories.find((x) => x.Number == this.auditory)?.Elements ?? []
    );
  }

  state = cellState(this, {
    schedules: () => this.Schedules,
    auditories: () => Array.from(new Set(this.Auditories.map((x) => x.Number))),
    auditory: () => this.auditory,
    day: () => this.day,
    selectedElement: () => this.selectedElement,
  });

  render() {
    return (
      <>
        {this.state.schedules.length > 0 && (
          <header className={styles.header}>Расписание</header>
        )}
        <HStack
          className={styles.chips}
          padding="16px 0"
          align="center"
          flexDirection="row"
          overflowX="scroll"
        >
          {Days.map((day) => {
            return (
              <Chip
                key={day}
                onClick={() => {
                  this.day = day;
                  this.auditory = 1;
                }}
                active={this.state.day == day}
              >
                {dayNames[day]}
              </Chip>
            );
          })}
        </HStack>
        {this.state.auditories.length > 1 && (
          <div className={styles.tags}>
            {this.state.auditories.map((auditory) => {
              return (
                <div
                  className={
                    this.state.auditory == auditory
                      ? styles.auditoryActive
                      : styles.auditory
                  }
                  key={auditory}
                  onClick={() => {
                    this.auditory = auditory;
                  }}
                >
                  {auditoryNames[auditory]}
                </div>
              );
            })}
          </div>
        )}
        {this.state.schedules.length > 0 && (
          <>
            {this.state.schedules.map((x, i) => (
              <div
                className={styles.schedule}
                onClick={() =>
                  (this.selectedElement =
                    this.state.selectedElement === x ? null : x)
                }
                key={i}
              >
                <div
                  className={x.IsCanceled ? styles.timeCanceled : styles.time}
                >
                  {x.IsCanceled ? "отмена" : x.Time}
                </div>
                <div className={styles.name}>{x.Name}</div>
                <ChevronUpIcon
                  className={
                    this.state.selectedElement === x
                      ? styles.expander
                      : styles.expanderOpened
                  }
                />
                {x.Changes && (
                  <div className={styles.changes}>
                    <span>Изменено</span>
                    {this.state.selectedElement === x && x.Changes}
                  </div>
                )}
                {this.state.selectedElement === x && (
                  <>
                    {x.Speaker && (
                      <div className={styles.info}>
                        <span>{x.Speaker}</span>
                      </div>
                    )}
                  </>
                )}
                <div className={styles.bottomLine} />
              </div>
            ))}
          </>
        )}
      </>
    );
  }

  componentDidUpdate(
    prevProps: Readonly<ScheduleProps>,
    prevState: Readonly<{}>,
    snapshot?: any
  ) {
    if (this.locationId !== this.props.locationId) {
      this.locationId = this.props.locationId;
      scheduleStore.loadSchedule(this.props.locationId);
    }
  }
}

const alertColors = {
  main: "#6BBDB0",
  red: "#EB5757",
  gray: "#BFBFBF",
};

function Alert({ color }) {
  return (
    <svg fill={color} width="20px" height="20px">
      <path d="M9 5H11V11H9V5ZM10 20C4.48 20 0 15.52 0 10C0 4.48 4.48 0 10 0C15.52 0 20 4.48 20 10C20 15.52 15.52 20 10 20ZM10 2C5.59 2 2 5.59 2 10C2 14.41 5.59 18 10 18C14.41 18 18 14.41 18 10C18 5.59 14.41 2 10 2ZM9 13H11V15H9V13Z" />
    </svg>
  );
}

type ScheduleProps = {
  locationId: number;
};

const Days: Day[] = ["Thursday", "Friday", "Saturday", "Sunday"];
const dayNames = {
  Thursday: "Четверг",
  Friday: "Пятница",
  Saturday: "Суббота",
  Sunday: "Воскресенье",
};
const auditoryNames = {
  1: "Аудитория 1",
  2: "Аудитория 2",
};
