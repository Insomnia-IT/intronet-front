import { FunctionalComponent } from "preact";
import { useEffect } from "preact/hooks";
import { useNotesRouter } from "../hooks/useNotesRouter";
import { filtersStore } from "../../../stores";
import { Tag, Tags } from "../../../components/tag";
import { SvgIcon } from "../../../icons";

import styles from "./filter-slider.module.css";
import { useCell } from "../../../helpers/cell-state";

export const FilteriesSlider: FunctionalComponent = () => {
  const notesRouter = useNotesRouter();
  const { filterId: activeFilterId, goToNotes } = notesRouter;
  const filters = useCell(() => filtersStore.filters);

  useEffect(() => {
    if (!activeFilterId) {
      goToNotes({ filterId: filtersStore.filterAll.id });
    }
  }, [activeFilterId]);

  return (
    <Tags<typeof filters> tagsList={filters} class={styles.tags}>
      {({ id, name, icon }) => {
        if (!name) {
          return null;
        }

        return (
          <Tag
            selected={activeFilterId === id}
            key={id}
            onClick={() => {
              goToNotes({ filterId: id });
            }}
            className={styles.tag}
          >
            {icon && (
              <SvgIcon id={`#${icon}`} size={14} style={{ paddingLeft: 4 }} />
            )}
            {name}
          </Tag>
        );
      }}
    </Tags>
  );
};
