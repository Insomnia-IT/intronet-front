import { ReactNode } from "react";
import { LocationScheduleInfoProps } from "./LocationScheduleInfo";

export type LocationScheduleProps = {
  schedules: Schedule[];
  day: Day;
  onDayChange?: (day: Day) => void;
  auditory: Auditory["number"];
  onAuditoryChange?: (auditory: Auditory["number"]) => void;
  auditories: Auditory[];
  auditoryElements: Auditory["elements"];
  locationId: number;
  selectedElement: AuditoryElement;
  onSelectedElementChange?: (auditoryElement: AuditoryElement) => void;
  renderScheduleInfo: (props: LocationScheduleInfoProps) => ReactNode;
  renderScheduleFooter?: (
    props: Pick<LocationScheduleInfoProps, "auditory" | "schedules" | "day">
  ) => ReactNode;
};
