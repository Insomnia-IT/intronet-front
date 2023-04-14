import { Button, ButtonsBar, CloseButton } from "@components";
import { Card } from "@components/cards";
import { useRouter } from "../routing";
import { Input } from "@components/input";
import { Link } from "@components/link/link";
import { useState } from "preact/hooks";
import { ticketStore } from "@stores/ticket.store";
import { useCell } from "@helpers/cell-state";

type Section = undefined | "ticket" | "check" | "success" | "error";
export const VotingPage = () => {
  const { route } = useRouter();
  switch (route[1] as Section) {
    case "ticket":
      return (
        <div class="page">
          <CloseButton />
          <h1>голосовать</h1>
          <VotingTicket />
        </div>
      );
    case undefined:
      return (
        <div class="page">
          <CloseButton />
          <h1>голосовать</h1>
          <VotingMain />
        </div>
      );
  }
};

const VotingTicket = () => {
  const state = useCell(ticketStore.state);
  const [ticket, setTicket] = useState("");
  const router = useRouter();
  if (state.isValidating) {
    return (
      <>
        <div>Проверяем номер билета</div>
        <div>Это может занять несколько минут</div>
      </>
    );
  }
  return (
    <>
      <div>Номер билета</div>
      <Input
        placeholder="000000"
        pattern="[0-9]+"
        minLength={6}
        maxLength={6}
        value={ticket}
        onInput={async (e) => {
          if (!e.currentTarget.validity.valid) return;
          setTicket(e.currentTarget.value);
        }}
      />
      <div>Где найти номер?</div>
      <div>
        Номер билета можно найти в приложении Vibe (для смарт-билетов) или на
        самом билете (PDF или бумажный)
      </div>
      <Link goTo="/main">У меня смарт-билет</Link>
      <Link goTo="/main">У меня PDF/бумажный</Link>
      <ButtonsBar at="bottom">
        <Button
          goTo="/voting/ticket"
          type="vivid"
          class="w-full"
          disabled={!ticket}
          onClick={async () => {
            await ticketStore.setTicket(ticket);
            router.goTo("/voting/success");
          }}
        >
          проверить номер
        </Button>
      </ButtonsBar>
    </>
  );
};
const VotingMain = () => (
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
