export * from "./EventModal";
export type ModalProps<T = any> = {
  show?: boolean;
  success?: <T = any>(result?: T) => void;
  abort?: () => void;
  isActive?: boolean;
} & { [key: string]: T };
