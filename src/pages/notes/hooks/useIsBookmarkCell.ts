import { useCell } from "@helpers/cell-state"
import { bookmarksStore } from "@stores/bookmarks.store";

export const useIsBookmarkCell = (noteId: string) => {
  return useCell(
    () => Boolean(bookmarksStore.getBookmark("note", noteId)),
    [noteId]
  );
}
