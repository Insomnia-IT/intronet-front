import React, { FC } from "preact/compat";
import { LocationScheduleInfoProps } from "./types";
import styles from "./styles.module.css";
import { ScheduleInfoMovie } from "./ScheduleInfoMovie";
import { Icons } from "@icons";

export const LocationScheduleInfo: FC<LocationScheduleInfoProps> = (props) => {
  const x = props.auditoryElement;
  return (
    <div className={styles.schedule} onClick={props.switchSelection}>
      <div className={x.isCanceled ? styles.timeCanceled : styles.time}>
        {x.isCanceled ? "отмена" : x.time}
      </div>
      <div className={styles.name}>
        {x.name}
        {x.age && <span className={styles.age}>{x.age}+</span>}
      </div>
      <Icons.ArrowRight
        className={props.selected ? styles.expander : styles.expanderOpened}
      />
      {x.changes && (
        <div className={styles.changes}>
          <span>Изменено</span>
          {props.selected && x.changes}
        </div>
      )}
      {props.selected && (
        <>
          {x.speaker && (
            <div className={styles.info}>
              <span>{x.speaker}</span>
            </div>
          )}
          {x.description && (
            <div className={styles.descr}>
              <span>{x.description}</span>
            </div>
          )}
          {x.movies && (
            <div className={styles.movies}>
              {x.movies.map((movie, index) => (
                <ScheduleInfoMovie key={index} movie={movie} />
              ))}
            </div>
          )}
        </>
      )}
      <div className={styles.bottomLine} />
    </div>
  );
};
