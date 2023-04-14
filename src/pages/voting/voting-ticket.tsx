import { useCell } from "@helpers/cell-state";
import { votingStore } from "@stores/votingStore";
import { useState } from "preact/hooks";
import { useRouter } from "../routing";
import { Input } from "@components/input";
import { Link } from "@components/link/link";
import { Button, ButtonsBar } from "@components";

export const VotingTicket = () => {
  const state = useCell(votingStore.state);
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
            await votingStore.setTicket(ticket);
            router.goTo("/voting/success");
          }}
        >
          проверить номер
        </Button>
      </ButtonsBar>
    </>
  );
};
