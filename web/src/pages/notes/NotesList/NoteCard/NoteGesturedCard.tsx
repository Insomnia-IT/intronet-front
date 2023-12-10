import { FunctionalComponent } from "preact";
import { TargetedEvent } from "preact/compat";
import { BookmarkGesture } from "../../../../components/BookmarkGesture/BookmarkGesture";
import { Gesture } from "../../../../helpers/Gestures";
import { bookmarksStore } from "../../../../stores/bookmarks.store";
import { useIsBookmarkCell } from "../../hooks/useIsBookmarkCell";
import { INoteCardProps, NoteCard } from "./NoteCard";

export type INoteGesturedCardProps = {
  gesture: Gesture;
} & INote & INoteCardProps;

export const NoteGesturedCard: FunctionalComponent<INoteGesturedCardProps> = ({ gesture, _id, ...props }) => {
  const isBookmark = useIsBookmarkCell(_id);
  const switchBookmark = () => bookmarksStore.switchBookmark('note', _id);
  const onBookmarkIconClick = (e: TargetedEvent) => {
    e.stopPropagation();
    switchBookmark()
  }

  return (
    <BookmarkGesture
      gesture={gesture}
      hasBookmark={isBookmark}
      switchBookmark={switchBookmark}
      borderRadius={24}
      contentNoOpacity
    >
      {({classNames, iconOpacity}) => {
        return (
          <NoteCard
            onIconClick={onBookmarkIconClick}
            _id={_id}
            iconClassNames={classNames}
            iconOpacity={iconOpacity}
            {...props}
          />
        )
      }}
    </BookmarkGesture>
  );
}
