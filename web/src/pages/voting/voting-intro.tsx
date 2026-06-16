import { authStore } from '@stores/auth.store'
import { Button, ButtonsBar } from "../../components";
import { Card } from "../../components/cards";
import { useCell } from "../../helpers/cell-state";
import { votingStore } from "../../stores/votingStore";
import { MovieSmall } from "../timetable/animation/movie-small";
import { useRouter } from '../routing'

export const VotingIntro = () => {
  const data = useCell(votingStore.state);
  const isAdmin = useCell(() => authStore.isAdmin);
  const { goTo } = useRouter();

  return (
    <>
      <Card border="Vivid" style={{ marginTop: 20 }}>
        <h2 class="colorVivid">Российский национальный конкурс</h2>
        <div class="text colorMediumBlue">Приз зрительских симпатий</div>
      </Card>
      {isAdmin && (
        <Button type='blue' onClick={() => goTo('/voting/result')}>Результаты</Button>
      )}
      {data.votedMovies.length === 0 ? (
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
            описание. Нажмите на кнопку «Голосую за этот мульт!». Или
            воспользуйтесь поиском.
            <br />
            <br />
            Вы можете голосовать за несколько мультфильмов.
            <br />
            <br />
            Мультфильмы, которые вы сохранили, находятся в Избранном.
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
            Вы проголосовали за {data.votedMovies.length} {data.votedMovies.length === 1 ? 'мультфильм' : data.votedMovies.length > 1 && data.votedMovies.length < 5 ? 'мультфильма' : 'мультфильмов'}!
          </div>
          <div class="text" style={{ margin: "16px 0" }}>
            Вы можете продолжить голосовать за другие работы или убрать свои голоса.
          </div>
          <ButtonsBar at="bottom">
            <Button goTo="/voting/list" type="blue" class="w-full">
              к списку мультфильмов
            </Button>
          </ButtonsBar>
        </>
      )}
    </>
  );
};
