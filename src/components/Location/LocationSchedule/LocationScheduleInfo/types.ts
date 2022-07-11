export type LocationScheduleInfoProps = {
  schedules: Schedule[];
  auditoryElement: AuditoryElement;
  auditoryElementIndex: number;
  day: Day;
  auditory: Auditory["number"];
  selected: boolean;
  switchSelection: () => void;
};
