import { FunctionalComponent } from "preact";
import { useMemo } from "preact/hooks";
import { useCell } from "@helpers/cell-state";
import { LocationStore } from "@stores";
import { bookmarksStore } from "@stores/bookmarks.store";
import { Button, ButtonsBar } from "@components";
import { SvgIcon } from "@icons";
import Styles from "./location.module.css";

export type LocationProps = {
  id: string;
  expanded?: boolean;
};

export const Location: FunctionalComponent<LocationProps> = ({
  id,
  expanded,
}) => {
  const store = useMemo(() => new LocationStore(id), [id]);
  const { location, hasBookmark } = useCell(store.state);

  return (
    <div className={Styles.content}>
      <div className={ ['sh1', Styles.locationHeader].join(" ") }>{location.name}</div>
      <div
        className={expanded ? Styles.descriptionExpanded : Styles.description}
      >
        {location.description}
      </div>

      <ButtonsBar at="bottom">
        <Button
          type="vivid"
          onClick={() =>
            bookmarksStore.switchBookmark("locations", location._id)
          }
          style={{
            width: "100%",
          }}
        >
          <SvgIcon id="#bookmark" size={14} />
          {hasBookmark ? "Удалить из избранного" : "сохранить в избранное"}
        </Button>
      </ButtonsBar>
    </div>
  );
};
