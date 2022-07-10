import React, { FC } from "react";
import { ScheduleInfoMovieProps } from "./types";

export const ScheduleInfoMovie: FC<ScheduleInfoMovieProps> = ({ movie }) => (
  <>
    <span style={{ gridColumn: 1 }}>
      {movie.name} / {movie.author} / {movie.country}
    </span>
    <span style={{ gridColumn: 2 }}>{movie.duration}"</span>
  </>
);
