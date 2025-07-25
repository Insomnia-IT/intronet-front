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
import { useOnlineState } from '@helpers/useOnlineState'
import styles from "./movie.module.css";
import { decodeHTMLEntities } from '@helpers/decodeHtmlEntities'

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
    <div flex column gap={2}>
      <PageHeader titleH2={movie?.name} align={"center"} withCloseButton />
      {movie.plot && (
        <div
          style={{
            marginBottom: 8,
          }}
          className="text colorGrey2 fontCondensed"
        >
          {decodeHTMLEntities(movie.plot)}
        </div>
      )}
      <div class="colorGrey">
        {[
          movie.author,
          movie.country,
          movie.info?.filmReleaseYear
        ].filter((x) => x).join(", ")}
      </div>
      {minutes != undefined && (
        <div class="colorGrey" style={{ marginBottom: 24 }}>
          {minutes} мин {seconds ? seconds + " сек" : ""}
        </div>
      )}
      {state.canVote && (
        <div flex column gap={2} style={{ marginBottom: 24 }}>
          <Card border="Vivid" gap={0}>
            <div flex column gap="2">
              <div class="sh2 colorGradient">Международный конкурс анимации</div>
              <div class="sh3 colorGrey">Приз зрительских симпатий</div>
            </div>
            <Link
              className="colorVivid"
              disabled={!isOnline}
              goTo={["voting", movie.id]}
              style={{
                marginTop: 20,
                marginBottom: 12,
              }}
            >
              Голосую за этот мульт!
            </Link>
            <div class="textSmall colorGrey">
              Голосовать можно онлайн и только 1 раз
            </div>
          </Card>

          {!isOnline && (
            <div class="colorVivid textSmall">
              Нет подключения к сети, вернитесь к точке WIFI, чтобы
              проголосовать
            </div>
          )}
        </div>
      )}
      <div flex column>
        <div className="sh1" style={{ marginBottom: 24 }}>Расписание показов:</div>
        {state.views.map((view) => (
          <div flex column gap={2} key={view.day + view.locationId}>
            <div class="tags colorGrey2">
              {getDayText(view.day, "full")}
            </div>
            <Card
              border="Grey"
              background="None"
              onClick={() => router.goTo(["map", view.locationId])}
              style={{ marginBottom: 16, gap: 8 }}
            >
              <div flex class="sh1" style={{alignItems: "center"}} gap={2}>
                <SvgIcon
                  id=".common #eye"
                  size={32}
                  style={{ color: "var(--vivid)" }}
                />
                {locationsStore.getName(view.locationId)}
              </div>
              <div flex column gap={4}>
                <div class="tags colorGrey2">
                  {view.block.info.Title} {view.block.info.SubTitle ?? ""}
                  {view.block.info.Part
                    ? ` — Часть ${view.block.info.Part}`
                    : ""}
                </div>
                <Link
                  className="colorMineral"
                  goTo={["map", view.locationId]}
                >
                  Локация на карте
                </Link>
                <div class="sh1 colorGrey2">
                  {view.start} - {view.end}
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>
      <ButtonsBar at="bottom">
        <Button
          type={state.hasBookmark ? "orange" : "blue"}
          class="w-full"
          onClick={() => bookmarksStore.switchBookmark("movie", movie.id)}
        >
          <BookmarkIcon size={24} class={styles.bookmarkIcon} />
          {state.hasBookmark
            ? "Удалить из избранного"
            : "сохранить в избранное"}
        </Button>
      </ButtonsBar>
    </div>
  );
};
