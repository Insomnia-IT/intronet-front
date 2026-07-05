import { FunctionalComponent } from "preact";
import { locationsStore, MovieStore } from "@stores";
import { useMemo } from "preact/hooks";
import { useCell } from "@helpers/cell-state";
import { getDayText } from "@helpers/getDayText";
import { useTimetableRouter } from "../timetable-page";
import { Card } from "@components";
import { Button, ButtonsBar } from "@components";
import { SvgIcon } from "@icons";
import { bookmarksStore } from "@stores/bookmarks.store";
import { Link } from "@components";
import { BookmarkIcon } from "@components/BookmarkGesture/bookmark-icon";
import { PageHeader } from "@components/PageHeader/PageHeader";
import { useOnlineState } from "@helpers/useOnlineState";
import { votingStore } from "@stores/votingStore";
import styles from "./movie.module.css";
import { decodeHTMLEntities } from "@helpers/decodeHtmlEntities";

export type MovieProps = {
  id: string;
};
export const Movie: FunctionalComponent<MovieProps> = (props) => {
  const router = useTimetableRouter();
  const store = useMemo(() => new MovieStore(props.id), [props.id]);
  const state = useCell(store.state);
  const movie = state.movie ?? ({} as MovieInfo);
  const screenLocations = useCell(() => locationsStore.ScreenLocations);
  const [minutes, seconds] = movie.info?.filmDuration?.split(/[:'"]/) ?? [];
  const isOnline = useOnlineState();
  if (!screenLocations.length) return <></>;
  return (
    <div flex column gap={2} class="movie-page">
      <PageHeader titleH2={movie?.name} align={"center"} withCloseButton />
      {movie.info?.hasImage && (
        <img
          class={styles.poster}
          src={`/public/images/movies/film_${movie.vurchelId}.webp`}
          alt={movie?.name}
          loading="lazy"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
        />
      )}
      {movie.plot && (
        <div
          style={{
            marginBottom: 8,
          }}
          className={styles.plot}
        >
          {decodeHTMLEntities(movie.plot)}
        </div>
      )}
      <div class={styles.meta}>
        {[movie.author, movie.country, movie.info?.filmReleaseYear]
          .filter((x) => x)
          .join(", ")}
      </div>
      {minutes != undefined && (
        <div class={styles.meta}>
          {minutes} мин {seconds ? seconds + " сек" : ""}
        </div>
      )}
      <div flex column gap={2} style={{ marginBottom: 24 }}>
        <Card background="Soft" gap={0}>
          <div flex column gap="2">
            <div class={`sh2 ${styles.votingHeader}`}>
              Международный конкурс анимации
            </div>
          </div>
          <div class={styles.votingDescription}>
            Вы можете голосовать за несколько мультфильмов
          </div>
          <Button
            type={state.isVoted ? "textDanger" : "text"}
            disabled={!isOnline}
            onClick={() => votingStore.vote(movie.id)}
            class={styles.votingButton}
          >
            {state.isVoted ? "Отменить голос" : "Голосую за этот мульт!"}
          </Button>
        </Card>

        {!isOnline && (
          <div class="textSmall colorDanger">
            Нет подключения к сети, вернитесь к точке WIFI, чтобы проголосовать
          </div>
        )}
      </div>
      <div flex column>
        <div className="sh1" style={{ marginBottom: 8 }}>
          Расписание показов:
        </div>
        {state.views.map((view) => (
          <div flex column gap={2} key={view.day + view.locationId}>
            <div class="tags colorTDarkDisabled">
              {getDayText(view.day, "full")}
            </div>
            <Card
              background="Soft2"
              onClick={() => router.goTo(["map", view.locationId])}
              style={{ marginBottom: 16, gap: 8 }}
            >
              <div flex class="sh1" style={{ alignItems: "center" }} gap={2}>
                {locationsStore.getName(view.locationId)}
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 16,
                  width: "100%",
                }}
              >
                <Link
                  goTo={["map", view.locationId]}
                  style={{
                    display: "block",
                    width: "100%",
                  }}
                >
                  Локация на карте
                </Link>
                <div>
                  <div class="textSmall colorTDarkDisabled">
                    {view.block.info.Title} {view.block.info.SubTitle ?? ""}
                    {view.block.info.Part
                      ? ` — Часть ${view.block.info.Part}`
                      : ""}
                  </div>
                  <div class="sh3">
                    {view.start} - {view.end}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>
      <ButtonsBar at="bottom">
        <Button
          type={state.hasBookmark ? "danger" : undefined}
          class="w-full"
          onClick={() => bookmarksStore.switchBookmark("movie", movie.id)}
        >
          {/* <BookmarkIcon size={24} class={styles.bookmarkIcon} /> */}
          {state.hasBookmark ? "удалить из избранного" : "в избранное"}
        </Button>
      </ButtonsBar>
    </div>
  );
};
