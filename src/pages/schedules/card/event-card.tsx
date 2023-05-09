import { FunctionalComponent } from "preact";
import { Card } from "@components/cards";
import Styles from "./event-card.module.css";
import { useMemo } from "preact/hooks";
import { EventStore, locationsStore } from "@stores";
import { useCell } from "@helpers/cell-state";
import { useSchedulesRouter } from "../schedules-page";

export type EventCardProps = {
  id: string;
  day: number;
  locationId: string;
  switchBookmark?(eventId: string): void;
};
export const EventCard: FunctionalComponent<EventCardProps> = (
  props
) => {
  const store = useMemo(
    () => new EventStore(props.id),
    [props.id]
  );
  const { auditory } = useCell(store.state);
  const router = useSchedulesRouter();

  return (
    <Card
      background="Purple"
      style={{ marginBottom: 8, padding: 16, paddingBottom: 18 }}
      onClick={(e) => e.defaultPrevented || router.goToEvent(props.id)}
    >
      <div className={Styles.eventContainer} flex column gap>
        <div class={[Styles.header, "sh1"].join(" ")}>
          {auditory.name}
        </div>

        <div className={`textSmall colorGray ${Styles.eventDescription}`}>{ auditory.description }</div>

        <div className={`${Styles.eventTimePlace} sh3`}>
          <span className={Styles.eventPlace}>{ locationsStore.getName(auditory.locationId) }</span>
          <span className={Styles.eventTime}>{ auditory.time }</span>
        </div>
      </div>
    </Card>
  );
};
