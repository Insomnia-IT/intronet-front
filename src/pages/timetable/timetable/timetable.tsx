import { DateTime } from "luxon";
import React, { FC, useState } from "preact/compat";
import styles from "../../../components/schedule/schedule.module.css";
import { locationsStore, moviesStore } from "@stores";
import { useCellState } from "@helpers/cell-state";
import { AnimationBlock } from "@components/cards/animation-block";
import style from "../../../app/app.style.module.css";

export type TimetableProps = {
  screens: InsomniaLocationFull[];
  screen: string;
  setScreen(screen: string): void;
  blocks: MovieBlock[];
};

export const Timetable: FC<TimetableProps> = ({
  screens,
  screen,
  blocks,
  setScreen,
}) => {
  return (
    <div class={style.page}>
      <h1>анимация</h1>
      <div className={styles.tags}>
        {screens.map((location) => (
          <div
            className={
              screen === location._id ? styles.auditoryActive : styles.auditory
            }
            key={location._id}
            onClick={() => {
              setScreen(location._id);
            }}
          >
            {location.name ?? screenNames[location._id]}
          </div>
        ))}
      </div>
      {blocks.map((x) => (
        <AnimationBlock block={x} key={x._id} />
      ))}
    </div>
  );
};

const screenNames = {
  1: "Полевой экран",
  2: "Речной экран",
};

export type TimetableSlot = {
  id: string | number;
  Title: string;
  Start: DateTime;
  End: DateTime;
};
