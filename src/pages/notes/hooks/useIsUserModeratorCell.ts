import { useCell } from "@helpers/cell-state";
import { notesStore } from "@stores";

export const useIsUserModeratorCell = () => {
  return useCell(() => notesStore.isUserModerator);
};
