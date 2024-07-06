import { Button, ButtonsBar, CloseButton, PageLayout } from "../../components";
import { useRouter } from "../routing";
import { useEffect } from "preact/hooks";
import { votingStore } from "../../stores/votingStore";
import { useCell } from "../../helpers/cell-state";
import { VotingList } from "./list";
import { VotingIntro } from "./voting-intro";
import { Vote } from "./vote";
import { VotingResults } from "./results";

type Section = undefined | "ticket" | "check" | "success" | "list" | "result";
export const VotingPage = () => {
  const { route, goTo } = useRouter();
  const state = useCell(votingStore.state);
  useEffect(() => {
    if (!route[1] && state.ticket) goTo("/voting/success", {}, true);
  }, [route[1], state.ticket]);
  switch (route[1] as Section) {
    case "success":
      return (
        <PageLayout gap={4}>
          <CloseButton />
          <h1>Готово!</h1>
          <div class="text colorMediumBlue" style={{ marginTop: 37 }}>
            Ваш голос учтён.
            <br />
            <br />
            Спасибо за участие в голосовании!
          </div>
          <ButtonsBar at="bottom">
            <Button goTo="/main" type="blue" class="w-full">
              на главную
            </Button>
          </ButtonsBar>
        </PageLayout>
      );
    case "list":
      return (
        <PageLayout gap={4}>
          <CloseButton />
          <h1>голосовать</h1>
          <VotingList />
        </PageLayout>
      );
    case "result":
      return (
        <PageLayout gap={4}>
          <CloseButton />
          <h1>голосовать</h1>
          <VotingResults />
        </PageLayout>
      );
    case undefined:
      return (
        <PageLayout gap={4}>
          <CloseButton />
          <h1>голосовать</h1>
          <VotingIntro />
        </PageLayout>
      );
    default:
      return (
        <PageLayout gap={4}>
          <CloseButton />
          <h1>Голосовать</h1>
          <Vote id={route[1] as string} />
        </PageLayout>
      );
  }
};
