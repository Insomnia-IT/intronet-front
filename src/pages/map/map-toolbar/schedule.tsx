import React from "react";
import { scheduleStore } from "../../../stores/schedule.store";
import { Computed, Observable } from "cellx-decorators";
import { cellState } from "../../../helpers/cell-state";
import { Flex, Grid, GridItem, Tag } from "@chakra-ui/react";
import styles from "./schedule.module.css";

export class ScheduleComponent extends React.PureComponent<ScheduleProps> {
  @Observable
  locationId: number;
  @Observable
  auditory: 1 | 2 = 1;
  @Observable
  day: Day = "Thursday";

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
  });

  render() {
    return (
      <>
        <Flex align="center" flexDirection="row">
          {Days.map((day) => {
            return (
              <Tag
                key={day}
                onClick={() => {
                  this.day = day;
                }}
                bg={this.state.day == day ? "#6BBDB0" : "white"}
                color={this.state.day == day ? "white" : "#718096"}
              >
                {dayNames[day]}
              </Tag>
            );
          })}
        </Flex>
        {this.state.auditories.length > 1 && (
          <div className={styles.tags}>
            {this.state.auditories.map((auditory) => {
              return (
                <Tag
                  className={
                    this.state.auditory == auditory
                      ? styles.tagSelected
                      : styles.tag
                  }
                  key={auditory}
                  onClick={() => {
                    this.auditory = auditory;
                  }}
                >
                  {auditoryNames[auditory]}
                </Tag>
              );
            })}
          </div>
        )}
        Расписание
        {this.state.schedules.map((x, i) => (
          <div className={styles.schedule} key={i}>
            <div className={styles.time}>{x.Time}</div>
            <div className={styles.name}>{x.Name}</div>
            <div className={styles.descr}>{x.Description}</div>
          </div>
        ))}
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
