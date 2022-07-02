import React from "react";
import { scheduleStore } from "../../../stores/schedule.store";
import { Observable } from "cellx-decorators";
import { cellState } from "../../../helpers/cell-state";
import { HStack } from "@chakra-ui/react";
import styles from "./schedule.module.css";
import { Chip } from "src/components/chip/chip";
import { ChevronUpIcon } from "@chakra-ui/icons";
import { locationsStore } from "../../../stores/locations.store";

export class ScheduleComponent extends React.PureComponent<ScheduleProps> {
  @Observable
  locationId: number;
  @Observable
  auditory: 1 | 2 = 1;
  @Observable
  day: Day = "Thursday";
  @Observable
  selectedElement: AuditoryElement;

  state = cellState(this, {
    schedules: () =>
      scheduleStore.getSchedules(this.locationId, this.day, this.auditory),
    auditories: () =>
      scheduleStore.getAuditorieNumbers(this.locationId, this.day),
    auditory: () => this.auditory,
    day: () => this.day,
    selectedElement: () => this.selectedElement,
    menu: () => locationsStore.Locations.get(this.locationId)?.menu,
  });

  render() {
    return (
      <div className={styles.content}>
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
                active={this.state.day === day}
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
                    this.state.auditory === auditory
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
        {this.state.schedules.map((x, i) => (
          <ScheduleInfo
            key={x.id}
            schedule={x}
            selected={this.state.selectedElement === x}
            switchSelection={() => {
              const isSelected = this.state.selectedElement === x;
              this.selectedElement = isSelected ? null : x;
            }}
          />
        ))}
        {this.state.menu && (
          <>
            <header className={styles.header}>Меню</header>
            {this.state.menu}
          </>
        )}
      </div>
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

export function ScheduleInfo(prop: {
  schedule: AuditoryElement;
  selected: boolean;
  switchSelection();
}) {
  const x = prop.schedule;
  return (
    <div className={styles.schedule} onClick={prop.switchSelection}>
      <div className={x.isCanceled ? styles.timeCanceled : styles.time}>
        {x.isCanceled ? "отмена" : x.time}
      </div>
      <div className={styles.name}>{x.name}</div>
      <ChevronUpIcon
        className={prop.selected ? styles.expander : styles.expanderOpened}
      />
      {x.changes && (
        <div className={styles.changes}>
          <span>Изменено</span>
          {prop.selected && x.changes}
        </div>
      )}
      {prop.selected && (
        <>
          {x.speaker && (
            <div className={styles.info}>
              <span>{x.speaker}</span>
            </div>
          )}
        </>
      )}
      <div className={styles.bottomLine} />
    </div>
  );
}

type ScheduleProps = {
  locationId: number;
};

const Days: Day[] = ["Thursday", "Friday", "Saturday", "Sunday", "Monday"];
const dayNames = {
  Thursday: "Четверг",
  Friday: "Пятница",
  Saturday: "Суббота",
  Sunday: "Воскресенье",
  Monday: "Понедельник",
};
const auditoryNames = {
  1: "Аудитория 1",
  2: "Аудитория 2",
};
