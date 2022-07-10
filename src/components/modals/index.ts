export * from "./NoteModal";
export * from "./LocationModal";
export * from "./LoginModal";
export * from "./ScheduleElementModal";

export type ModalProps<T = any> = {
  show?: boolean;
  success?: <T = any>(result?: T) => void;
  abort?: () => void;
  isActive?: boolean;
} & T;
