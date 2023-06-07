export * from "./LocationModal";
export * from "./LoginModal";
export * from "./LogoutModal";

export type ModalProps<T = any> = {
  show?: boolean;
  success?: <T = any>(result?: T) => void;
  abort?: () => void;
  isActive?: boolean;
} & T;
