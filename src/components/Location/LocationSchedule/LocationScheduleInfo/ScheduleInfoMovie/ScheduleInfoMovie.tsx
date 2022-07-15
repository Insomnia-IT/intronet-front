import React, { FC } from "react";
import { ScheduleInfoMovieProps } from "./types";

export const ScheduleInfoMovie: FC<ScheduleInfoMovieProps> = ({ movie }) => (
  <>
    <span style={{ gridColumn: 1 }}>
      {movie.name}
      <br />
      <span style={{ fontSize: "0.8em", color: "#AAA" }}>
        {" "}
        {movie.author} / {movie.country} / {movie.year}
      </span>
    </span>
    <span style={{ gridColumn: 2, fontWeight: "700", fontSize: "0.8em" }}>
      {movie.duration}
    </span>
  </>
);
