import { useCell } from "@helpers/cell-state";
import { FunctionalComponent } from "preact";
import { moviesStore } from "@stores";
import { useEffect, useState } from "preact/hooks";
import { MovieSmall } from "../timetable/animation/movie-small";
import { api } from "@stores/api";
import { authStore } from "@stores/auth.store";

export const VotingResults: FunctionalComponent = () => {
  const movies = useCell(() => moviesStore.VotingMovies ?? []);
  const [votes, setVotes] = useState<Array<{ id: string; count: number }>>([]);
  useEffect(() => {
    fetch(`${api}/vote`, {
      headers: authStore.headers,
    })
      .then((x) => (x.ok ? x.json() : []))
      .then((x) => setVotes(x));
  }, []);
  return (
    <div flex column gap={3} style={{ marginTop: 29 }}>
      Результаты
      {votes.map(({ id, count }) => (
        <div style={{ position: "relative" }} key={id}>
          <div
            style={{
              position: "absolute",
              zIndex: 1,
              right: 0,
              top: 0,
              color: "var(--cold-white)",
              borderRadius: 10,
              padding: "6px 20px",
              background: "var(--ins-night)",
            }}
          >
            {count}
          </div>
          <MovieSmall movie={movies.find((x) => x.id === id)} />
        </div>
      ))}
    </div>
  );
};
