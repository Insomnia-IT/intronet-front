import { Button, ButtonsBar } from "@components";
import {useCell} from "@helpers/cell-state";
import {votingStore} from "@stores/votingStore";
import {MovieSmall} from "../timetable/animation/movie-small";

export const VotingIntro = () => {
  const data = useCell(votingStore.state)
  return (
    <>
      <h2 class="menu colorPink" style={{
        marginBottom: 16,
        marginTop: 37
      }}>Международный конкурс анимации</h2>
      <div class="text colorMediumBlue">Номинация «Приз зрительских симпатий»</div>
      {!data.votedMovie ? <>
        <div class="sh1" style={{marginTop: 24, marginBottom: 16}}>Голосовать можно только онлайн!</div>
        <div class="sh3 colorMediumBlue">Подлючиться к сети можно на Инфоцентре и возле экранов.</div>
        <div class="sh1" style={{marginTop: 32, marginBottom: 16}}>Как голосовать?</div>
        <div class="text colorMediumBlue">
          В разделе Анимация нажмите на название мультфильма, откроется его описание.
          Нажмите на кнопку «Голосую за эту работу!».
          Или воспользуйтесь поиском.
          <br/><br/>
          Мультфильмы, которые вы сохранили находятся в Избранном.
        </div>
      </> : <>
        <div class="sh1" style={{marginTop: 32}}>Вы уже проголосовали!</div>
        <div class="text" style={{margin: '16px 0'}}>Ваш голос был отдан этой работе</div>
        <MovieSmall disabled movie={data.votedMovie}/>
      </>}
      <ButtonsBar at="bottom">
        <Button goTo="/timetable" type="vivid" class="w-full">
          к анимации
        </Button>
      </ButtonsBar>
    </>
  );
}
