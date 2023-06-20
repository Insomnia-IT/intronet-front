import { FunctionalComponent } from "preact";
import { locationsStore, moviesStore, MovieStore } from "@stores";
import { useMemo } from "preact/hooks";
import { useCell } from "@helpers/cell-state";
import { getDayText } from "@helpers/getDayText";
import { useTimetableRouter } from "../timetable-page";
import { Card } from "@components/cards";
import { Button, ButtonsBar } from "@components";
import { SvgIcon } from "@icons";
import { bookmarksStore } from "@stores/bookmarks.store";
import { Link } from "@components/link/link";
import { votingStore } from "@stores/votingStore";

export type MovieProps = {
  id: string;
};
export const Movie: FunctionalComponent<MovieProps> = (props) => {
  const router = useTimetableRouter();
  const store = useMemo(() => new MovieStore(props.id), [props.id]);
  const state = useCell(store.state);
  const movie = state.movie ?? ({} as MovieInfo);
  const screenLocations = useCell(() => locationsStore.ScreenLocations);
  console.log(screenLocations);
  const [minutes, seconds] = movie.duration?.split(/[:'"]/) ?? [];
  const { votedMovie, isOnline } = useCell(votingStore.state);
  if (!screenLocations.length) return <></>;
  return (
    <div flex column gap={2}>
      <header className="sh1" style={{marginBottom: 16}}>{movie?.name}</header>
      {movie.description && <div style={{
        marginBottom: 8
      }} className="text colorMediumBlue">{movie?.description}</div>}
      <div class="colorGray">
        {movie.author}, {movie.country}, {movie.year}
      </div>
      <div class="colorGray">
        {minutes} мин {seconds} сек
      </div>
      {!votedMovie && (
        <div flex column gap={2} style={{ marginBottom: 24, marginTop: 24 }}>
          <Card border="Vivid" gap={0}>
            <div flex column gap="2">
              <div class="sh2 colorPink">Международный конкурс анимации</div>
              <div class="sh3 colorPink">Приз зрительских симпатий</div>
            </div>
            <Link disabled={!isOnline} goTo={["voting", movie.id]} style={{
              marginTop: 20,
              marginBottom: 12
            }}>
              Голосую за эту работу!
            </Link>
            <div class="textSmall colorGray">Голосовать можно онлайн и только 1 раз</div>
          </Card>

          {!isOnline && (
            <div class="colorPink textSmall">
              Нет подключения к сети, вернитесь к точке WIFI, чтобы
              проголосовать
            </div>
          )}
        </div>
      )}
      <div flex column gap={6}>
        <div className="sh1">Расписание показов:</div>
        {state.block.views.map((view) => (
          <div flex column gap={3} key={view.day + view.locationId}>
            <div class="tags colorMediumBlue">
              {getDayText(view.day, "full")}
            </div>
            <Card
              border="Blue"
              background="None"
              onClick={() => router.goTo(["map", view.locationId])}
            >
              <div flex class="sh1" gap={2}>
                <SvgIcon id=".common #eye" size={32} style={{ color: "var(--electric-blues)" }} />
                {locationsStore.getName(view.locationId)}
              </div>
              <Link
                goTo={["map", view.locationId]}
                style={{ marginBottom: 18 }}
              >
                Локация на карте
              </Link>
              <div flex column gap={2}>
                <div class="tags colorMediumBlue">
                  {state.block.info.Title} {state.block.info.SubTitle}
                </div>
                <div class="sh1">
                  {view.start} - {view.end}
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>
      <ButtonsBar at="bottom">
        <Button
          type="vivid" class="w-full"
          onClick={() => bookmarksStore.switchBookmark("movie", movie.id)}
        >
          <SvgIcon id="#bookmark" size={14} />
          {state.hasBookmark
            ? "Удалить из избранного"
            : "сохранить в избранное"}
        </Button>
      </ButtonsBar>
    </div>
  );
};
