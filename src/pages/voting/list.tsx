import {Card} from "@components/cards";
import { useCell } from "@helpers/cell-state";
import { votingStore } from "@stores/votingStore";
import {useEffect, useState} from "preact/hooks";
import { useRouter } from "../routing";
import { Input } from "@components/input";
import { Link } from "@components/link/link";
import { Button, ButtonsBar } from "@components";
import { FunctionalComponent } from "preact";
import {MovieList} from "../timetable/animation/movie-list";
import { MovieSmall } from "../timetable/animation/movie-small";
import { moviesStore } from "@stores";

export const VotingList: FunctionalComponent = () => {
  const movies = useCell(() => moviesStore.VotingBlock?.movies ?? []);
  return (
    <div flex column gap={3} style={{marginTop: 29}}>
      <div class="sh1">Мультфильмы, которые участвуют в международном конкурсе анимации</div>
      <MovieList movies={movies}/>
    </div>
  );
};
