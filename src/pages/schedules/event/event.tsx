import { FunctionalComponent } from "preact";
import { EventStore, locationsStore } from "@stores";
import { useMemo } from "preact/hooks";
import { useCell } from "@helpers/cell-state";
import Styles from "../animation/animation.module.css";
import { Button, ButtonsBar } from "@components";
import { SvgIcon } from "@icons";
import { bookmarksStore } from "@stores/bookmarks.store";
import { useSchedulesRouter } from "../schedules-page";

export type EventProps = {
  id: string;
};
export const Event: FunctionalComponent<EventProps> = (props) => {
  const router = useSchedulesRouter();
  const store = useMemo(() => new EventStore(props.id), [props.id]);
  const {auditory, hasBookmark} = useCell(store.state);

  return (
    <div flex column gap={2}>
      <header className="sh1">«{auditory?.name}»</header>
      {auditory?.description && <div className="text">{auditory?.description}</div>}
      <div class="colorGray sh3">
        {auditory?.speaker}
      </div>

      <ButtonsBar at="bottom">
        <Button
          type="vivid"
            onClick={() => bookmarksStore.switchBookmark("movie", auditory._id)}
        >
          <SvgIcon id="#bookmark" size={14} />
          {hasBookmark
            ? "Удалить из избранного"
            : "сохранить в избранное"}
        </Button>
      </ButtonsBar>
    </div>
  );
};
