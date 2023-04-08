import { JSX } from "preact/jsx-runtime";
import { LocationScheduleInfoProps } from "./LocationScheduleInfo";

export type LocationScheduleProps = {
  schedules: Schedule[];
  day: Day;
  onDayChange?: (day: Day) => void;
  auditory: Auditory["number"];
  onAuditoryChange?: (auditory: Auditory["number"]) => void;
  auditories: (1 | 2)[];
  auditoryElements: Auditory["elements"];
  locationId: string;
  selectedElement: AuditoryElement;
  onSelectedElementChange?: (auditoryElement: AuditoryElement) => void;
  renderScheduleInfo?: (props: LocationScheduleInfoProps) => JSX.Element;
  renderScheduleFooter?: (
    props: Pick<LocationScheduleInfoProps, "auditory" | "schedules" | "day">
  ) => JSX.Element;
};
