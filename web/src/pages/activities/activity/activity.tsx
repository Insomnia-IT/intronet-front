import { FunctionalComponent } from "preact";
import { useMemo } from "preact/hooks";
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
import { PageHeader } from "@components/PageHeader/PageHeader";
import {
  AgeStrict,
  AgeStrictValue,
  isAgeBadgeVisible,
} from "@components/age-strict";

export type ActivityProps = {
  id: string;
};
export const Activity: FunctionalComponent<ActivityProps> = ({ id }) => {
  const router = useActivitiesRouter();
  const store = useMemo(() => new ActivityStore(id), [id]);
  const { activity, hasBookmark } = useCell(store.state);

  return (
    <div flex column gap={4} style={{ paddingBottom: 80 }}>
      {activity && (
        <>
          <PageHeader
            titleH2={
              <div className={Styles.titleRow}>
                <span dangerouslySetInnerHTML={{ __html: activity.title }} />
                {isAgeBadgeVisible(activity.age) && (
                  <AgeStrict
                    age={activity.age as AgeStrictValue}
                    className={Styles.titleAgeBadge}
                  />
                )}
              </div>
            }
            align={"top"}
            withCloseButton
          />

          {activity.description && (
            <div
              className="text colorGrey"
              dangerouslySetInnerHTML={{
                __html: activity.description.replaceAll(/\\n/g, "<br/>"),
              }}
            />
          )}
          {activity.authors?.map((author) => (
            <div class={Styles.author}>
              {author.id && author.hasPhoto && (
                <img
                  className={Styles.authorPhoto}
                  src={`/public/images/events/participant_${author.id}.webp`}
                  alt=""
                  loading="lazy"
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).style.display =
                      "none";
                  }}
                />
              )}
              <div class={Styles.authorInfo}>
                <div className={Styles.authorName}>{author.name}</div>
                <div
                  className={Styles.authorDescription}
                  dangerouslySetInnerHTML={{
                    __html: [author.description]
                      .filter((x) => x)
                      .join(". ")
                      .replaceAll(/\\n/g, "<br/>"),
                  }}
                />
              </div>
            </div>
          ))}
          {activity.day !== undefined && (
            <div className="colorMediumBlue sh3">
              {getDayText(activity?.day, "full")}
            </div>
          )}

          <Card
            background="Soft2"
            onClick={() => router.goTo(["map", activity?.locationId])}
          >
            <div flex className="sh1" gap={2}>
              {locationsStore.getName(activity?.locationId) ??
                activity?.locationId}
            </div>

            <Link
              goTo={["map", activity?.locationId]}
              style={{ marginBottom: 18, display: "block", width: "100%" }}
            >
              локация на карте
            </Link>

            <div flex column gap={1} style={{ alignItems: "flex-start" }}>
              {activity?.isCanceled && (
                <Badge type={"Change"}>Отменилось =(</Badge>
              )}
              <div
                className={[
                  "sh1",
                  activity?.isCanceled ? Styles.canceled : "default",
                ].join(" ")}
              >
                {!activity?.end.startsWith("undefined")
                  ? `${activity?.start} - ${activity?.end}`
                  : `c ${activity.start}`}
              </div>
            </div>
          </Card>

          <ButtonsBar at="bottom">
            <Button
              type={hasBookmark ? "orange" : "blue"}
              onClick={() =>
                bookmarksStore.switchBookmark("activity", activity._id)
              }
              style={{
                width: "100%",
              }}
            >
              {/* <BookmarkIcon size={24}/> */}
              {hasBookmark ? "Удалить из избранного" : "в избранное"}
            </Button>
          </ButtonsBar>
        </>
      )}
    </div>
  );
};
