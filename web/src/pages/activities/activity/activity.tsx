import { FunctionalComponent } from "preact";
import {useEffect, useMemo} from "preact/hooks";
import { locationsStore } from "@stores";
import { bookmarksStore } from "@stores/bookmarks.store";
import { ActivityStore } from "@stores/activities/activities.store";
import { useCell } from "@helpers/cell-state";
import { getDayText } from "@helpers/getDayText";
import { Button, ButtonsBar } from "@components";
import { Card } from "@components";
import { Link } from "@components";
import { SvgIcon } from "@icons";
import { Badge } from "@components/badge/badge";
import { useActivitiesRouter } from "../hooks/useActivitiesRouter";
import Styles from "./activity.module.css";
import { BookmarkIcon } from "@components/BookmarkGesture/bookmark-icon";
import {PageHeader} from "@components/PageHeader/PageHeader";

export type ActivityProps = {
  id: string;
};
export const Activity: FunctionalComponent<ActivityProps> = ({id}) => {
  const router = useActivitiesRouter();
  const store = useMemo(() => new ActivityStore(id), [id]);
  const { activity, hasBookmark } = useCell(store.state);

  return (
    <div flex column gap={4}>
      {activity && (<>
          <PageHeader titleH2={activity?.title} align={'top'} withCloseButton/>

          {activity.description && <div className="text">{activity?.description}</div>}
          {
            activity.author &&
            <div className="colorGray sh3">
              {activity?.author}{activity?.authorDescription ? `. ${activity?.authorDescription}` : ''}
            </div>
          }
          {activity.day !== undefined && <div className="colorMediumBlue sh3">{getDayText(activity?.day, "full")}</div>}

          <Card
            border="Blue"
            background="None"
            onClick={() => router.goTo(["map", activity?.locationId])}>
            <div flex className="sh1" gap={2}>
              <SvgIcon
                id="#alert"
                size={32}
                style={{color: "var(--electric-blues)"}}
              />
              {locationsStore.getName(activity?.locationId) ?? activity?.locationId}
            </div>

            <Link goTo={["map", activity?.locationId]} style={{marginBottom: 18}}>
              на карте
            </Link>

            <div flex column gap={1} style={{alignItems: "flex-start"}}>
              {activity?.isCanceled && <Badge type={"Change"}>Отменилось =(</Badge>}
              <div
                className={[
                  "sh1",
                  activity?.isCanceled ? Styles.canceled : "default",
                ].join(" ")}
              >
                {!activity?.end.startsWith('undefined') ? `${activity?.start} - ${activity?.end}` : `c ${activity.start}`}
              </div>
            </div>
          </Card>

          <ButtonsBar at="bottom">
            <Button
              type={hasBookmark ? 'orange' : 'blue'}
              onClick={() =>
                bookmarksStore.switchBookmark("activity", activity._id)
              }
              style={{
                width: "100%",
              }}
            >
              <BookmarkIcon size={14}/>
              {hasBookmark ? "Удалить из избранного" : "сохранить в избранное"}
            </Button>
          </ButtonsBar>
        </>
      )}
    </div>
  );
};
