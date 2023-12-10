import { FunctionalComponent } from "preact";
import { TargetedEvent } from "preact/compat";
import { BookmarkGesture } from "../../../components/BookmarkGesture/BookmarkGesture";
import { Gesture } from "../../../helpers/Gestures";
import { bookmarksStore } from "../../../stores/bookmarks.store";
import { ActivityCard, ActivityCardProps } from "./activity-card";
import { useCell } from "../../../helpers/cell-state";

export type IActivityGesturedCardProps = {
  gesture: Gesture;
  showDate?: boolean;
} & ActivityCardProps;

export const ActivityGesturedCard: FunctionalComponent<IActivityGesturedCardProps> = ({gesture, showDate, id, ...props}) => {
  const hasBookmark = useCell(
    () => !!bookmarksStore.getBookmark("activity", id),
    [ id ]
  );
  const switchBookmark = () => bookmarksStore.switchBookmark('activity', id);
  const onBookmarkIconClick = (e: TargetedEvent) => {
    e.stopPropagation();
    switchBookmark()
  }

  return (
    <BookmarkGesture
      gesture={ gesture }
      hasBookmark={ hasBookmark }
      switchBookmark={ switchBookmark }
      borderRadius={ 24 }
      contentNoOpacity
    >
      { ({classNames, iconOpacity}) => {
        return (
          <ActivityCard
            onIconClick={ onBookmarkIconClick }
            id={ id }
            showDate={showDate}
            iconClassNames={ classNames }
            iconOpacity={ iconOpacity }
            { ...props }
          />
        )
      } }
    </BookmarkGesture>
  );
}
