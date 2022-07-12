export * from "./NoteModal";
export * from "./LocationModal";
export * from "./LoginModal";
export * from "./ScheduleElementModal";
export * from "./LogoutModal";
export * from "./CategoriesModal";
export * from "./CategoryModal";

export type ModalProps<T = any> = {
  show?: boolean;
  success?: <T = any>(result?: T) => void;
  abort?: () => void;
  isActive?: boolean;
} & T;
