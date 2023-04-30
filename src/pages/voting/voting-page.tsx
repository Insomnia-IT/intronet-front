import { CloseButton } from "@components";
import { useRouter } from "../routing";
import { useEffect } from "preact/hooks";
import { votingStore } from "@stores/votingStore";
import { useCell } from "@helpers/cell-state";
import { VotingTicket } from "./voting-ticket";
import { VotingIntro } from "./voting-intro";
import { VotingMain } from "./voting-main";
import { Vote } from "./vote";

type Section = undefined | "ticket" | "check" | "success" | "error";
export const VotingPage = () => {
  const { route, goTo } = useRouter();
  const state = useCell(votingStore.state);
  useEffect(() => {
    if (!route[1] && state.ticket) goTo("/voting/success", {}, true);
  }, [route[1], state.ticket]);
  switch (route[1] as Section) {
    case "ticket":
      return (
        <div class="page">
          <CloseButton />
          <h1>голосовать</h1>
          <VotingTicket />
        </div>
      );
    case "success":
      return (
        <div class="page">
          <CloseButton />
          <h1>голосовать</h1>
          <VotingMain />
        </div>
      );
    case undefined:
      return (
        <div class="page">
          <CloseButton />
          <h1>голосовать</h1>
          <VotingIntro />
        </div>
      );
    default:
      return (
        <div class="page">
          <CloseButton />
          <h1>готово</h1>
          <Vote id={route[1] as string} />
        </div>
      );
  }
};
