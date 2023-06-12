import { IsConnected } from "@stores/connection";
import { useCell } from "./cell-state";

/**
 * Хук для отслеживания онлайн-статуса устройства
 */
export const useOnlineState = () => {
  const isOnline = useCell(IsConnected);

  return { isOnline };
};
