import { Button, ButtonsBar } from "../../components";
import { Card } from "../../components/cards";
import { useCell } from "../../helpers/cell-state";
import { votingStore } from "../../stores/votingStore";
import { MovieSmall } from "../timetable/animation/movie-small";

export const VotingIntro = () => {
  const data = useCell(votingStore.state);
  return (
    <>
      <Card border="Vivid" style={{ marginTop: 20 }}>
        <h2 class="colorPink">Международный конкурс анимации </h2>
        <div class="text colorMediumBlue">Приз зрительских симпатий</div>
      </Card>
      {!data.votedMovie ? (
        <>
          <div class="sh1" style={{ marginTop: 24, marginBottom: 16 }}>
            Голосовать можно только онлайн!
          </div>
          <div class="text colorMediumBlue">
            Подлючиться к сети можно на Инфоцентре и возле экранов.
          </div>
          <div class="sh1" style={{ marginTop: 32, marginBottom: 16 }}>
            Как голосовать?
          </div>
          <div class="text colorMediumBlue">
            В разделе Анимация нажмите на название мультфильма, откроется его
            описание. Нажмите на кнопку «Голосую за эту работу!». Или
            воспользуйтесь поиском.
            <br />
            <br />
            Мультфильмы, которые вы сохранили, находятся в Избранном.
          </div>
          <div class="sh2 colorMediumBlue" style={{ marginTop: 32 }}>
            Обратите внимание, что не все мультфильмы участвуют в конкурсе.
            Полный список работ, за которые можно проголосовать мы собрали на
            отдельной странице
          </div>
          <ButtonsBar at="bottom">
            <Button goTo="/voting/list" type="blue" class="w-full">
              к списку мультфильмов
            </Button>
          </ButtonsBar>
        </>
      ) : (
        <>
          <div class="sh1" style={{ marginTop: 32 }}>
            Вы уже проголосовали!
          </div>
          <div class="text" style={{ margin: "16px 0" }}>
            Ваш голос был отдан этой работе
          </div>
          <MovieSmall disabled movie={data.votedMovie} />
        </>
      )}
    </>
  );
};
