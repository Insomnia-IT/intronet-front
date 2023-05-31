import { FunctionalComponent } from "preact";
import { useMemo } from "preact/hooks";
import { locationsStore } from "@stores";
import { ActivityStore } from "@stores/activities.store";
import { bookmarksStore } from "@stores/bookmarks.store";
import { useCell } from "@helpers/cell-state";
import { coerceTime } from "@helpers/getDayText";
import { Button, ButtonsBar } from "@components";
import { Card } from "@components/cards";
import { Link } from "@components/link/link";
import { SvgIcon } from "@icons";
import { useActivitiesRouter } from "../activities-page";
import { Badge } from "@components/badge/badge";
import Styles from "./activity.module.css";

export type ActivityProps = {
  id: string;
};
export const Activity: FunctionalComponent<ActivityProps> = (props) => {
  const router = useActivitiesRouter();
  const store = useMemo(() => new ActivityStore(props.id), [props.id]);
  const { activity, hasBookmark } = useCell(store.state);

  return (
    <div flex column gap={4}>
      <header className="sh1">«{activity?.title}»</header>
      {activity?.description && (
        <div className="text">{activity?.description}</div>
      )}
      <div class="colorGray sh3">{activity?.author}</div>

      <Card
        border="Blue"
        background="None"
        onClick={() => router.goTo(["map", activity?.locationId])}
      >
        <div flex center class="sh1" gap={2}>
          <SvgIcon id="#eye" style={{ color: "var(--electric-blues)" }} />
          {locationsStore.getName(activity?.locationId)}
        </div>
        <Link goTo={["map", activity?.locationId]} style={{ marginBottom: 18 }}>
          Локация на карте
        </Link>
        <div flex column gap={1}>
          {activity?.isCanceled && (
            <Badge type={"Change"}>{"Отменилось :("}</Badge>
          )}
          <div
            class={[
              "sh1",
              activity?.isCanceled ? Styles.canceled : "default",
            ].join(" ")}
          >
            {coerceTime(activity?.start)} - {coerceTime(activity?.end)}
          </div>
        </div>
      </Card>
      <ButtonsBar at="bottom">
        <Button
          type="vivid"
          onClick={() =>
            bookmarksStore.switchBookmark("activity", activity._id)
          }
        >
          <SvgIcon id="#bookmark" size={14} />
          {hasBookmark ? "Удалить из избранного" : "сохранить в избранное"}
        </Button>
      </ButtonsBar>
    </div>
  );
};
