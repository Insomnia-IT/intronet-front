import { FunctionalComponent } from "preact";
import { locationsStore, moviesStore, MovieStore } from "@stores";
import { useMemo } from "preact/hooks";
import { useCell } from "@helpers/cell-state";
import style from "../../../app/app.style.module.css";
import Styles from "../animation/animation.module.css";
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
  const [minutes, seconds] = movie.duration?.split(/[:'"]/) ?? [];
  const { ticket, isOnline } = useCell(votingStore.state);
  if (!screenLocations.length) return <></>;
  return (
    <div flex column gap={2}>
      <header className="sh1">«{movie?.name}»</header>
      {movie.description && <div className="sh1">{movie?.description}</div>}
      <div class="colorGray">
        {movie.author}, {movie.country}, {movie.year}
      </div>
      <div class="colorGray">
        {minutes} мин {seconds} сек
      </div>
      <div style={{ marginBottom: 24 }}>
        <Card border="Vivid" background="White">
          <div flex column gap="2">
            <div class="sh2 colorPink">Международный конкурс анимации</div>
            <div class="sh3 colorPink">Приз зрительских симпатий</div>
          </div>
          {ticket ? (
            <>
              <Button
                class="w-full unbounded"
                style={{
                  fontSize: 14,
                }}
                type="vivid"
                disabled={!isOnline}
                goTo={["voting", movie.id]}
              >
                Голосую за этот мульт
              </Button>
            </>
          ) : (
            <div flex column gap="2">
              <Link goTo="/voting">Голосование</Link>
              <div class="textSmall colorGray">
                Голосовать можно только онлайн
                <br />
                Для голосования потребуется номер билета
              </div>
            </div>
          )}
        </Card>

        {ticket && !isOnline && (
          <div class="colorPink">
            Нет подключения к сети, вернитесь к точке WIFI, чтобы проголосовать
          </div>
        )}
      </div>
      <div flex column gap={6}>
        <div className="sh1">Расписание показов:</div>
        {state.block.views.map((view) => (
          <div flex column gap={3} key={view.day + view.locationId}>
            <div class="tags colorMediumBlue">
              {getDayText(view.day, "full")}
            </div>
            <Card border="Blue" background="None">
              <div flex center class="sh1" gap={2}>
                <SvgIcon id="#eye" style={{ color: "var(--electric-blues)" }} />
                {locationsStore.getName(view.locationId)}
              </div>
              <Link
                goTo={["map", view.locationId]}
                style={{ marginBottom: 18 }}
              >
                Локация на карте
              </Link>
              <div flex column gap={1}>
                <div class="tags colorMediumBlue" flex gap={2}>
                  <div>{state.block.info.Title}</div>
                  <div>{state.block.info.SubTitle}</div>
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
          type="vivid"
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
