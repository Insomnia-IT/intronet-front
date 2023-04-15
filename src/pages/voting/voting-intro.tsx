import { Card } from "@components/cards";
import { Button, ButtonsBar } from "@components";

export const VotingIntro = () => (
  <>
    <Card background="White" border="Vivid">
      <h2 class="menu colorPink">Международный конкурс анимации</h2>
      <div class="text">Приз зрительских симпатий</div>
    </Card>
    <div>
      О конкурсе Отличный тамада и конкурсы интересные Правила голосования Один
      билет — один голос Потребуется номер билета Голосовать можно только
      онлайн! Интернет есть на Инфоцентре
    </div>
    <ButtonsBar at="bottom">
      <Button goTo="/voting/ticket" type="vivid" class="w-full">
        голосовать
      </Button>
    </ButtonsBar>
  </>
);
