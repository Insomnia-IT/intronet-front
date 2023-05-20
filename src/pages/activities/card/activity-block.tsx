import { FunctionalComponent } from "preact";
import { useMemo } from "preact/hooks";
import { Card } from "@components/cards";
import { useCell } from "@helpers/cell-state";
import { locationsStore } from "@stores";
import { useActivitiesRouter } from "../activities-page";
import Styles from "./activity-card.module.css";
import { ActivityStore } from "@stores/activities.store";
import { coerceTime } from "@helpers/getDayText";

export type ActivityBlockProps = {
  id: string;
  day: number;
  locationId: string;
  switchBookmark?(eventId: string): void;
};
export const ActivityBlock: FunctionalComponent<ActivityBlockProps> = (
  props
) => {
  const store = useMemo(
    () => new ActivityStore(props.id),
    [props.id]
  );
  const { activity } = useCell(store.state);
  const router = useActivitiesRouter();

  return (
    <Card
      background="Purple"
      style={{ marginBottom: 8, padding: 16, paddingBottom: 18 }}
      onClick={(e) => e.defaultPrevented || router.goToActivity(props.id)}
    >
      <div className={Styles.eventContainer} flex column gap>
        <div class={[Styles.header, "sh1"].join(" ")}>
          {activity?.title}
        </div>

        <div className={`textSmall colorGray ${Styles.eventDescription}`}>{ activity?.description }</div>

        <div className={`${Styles.eventTimePlace} sh3`}>
          <span className={Styles.eventPlace}>{ locationsStore.getName(activity?.locationId) }</span>
          <span className={Styles.eventTime}>{coerceTime(activity.start)} - { coerceTime(activity.end) }</span>
        </div>
      </div>
    </Card>
  );
};
