import * as React from "preact/compat";
import { RequireAuth } from "@components/RequireAuth";
import { categoriesStore } from "@stores";
import styles from "./categoryCard.module.css";

interface ICategoryCard {
  categoryObj: ICategory;
  isActive?: boolean;
  onClick?: () => void;
  onIconLeftClick?: (category: ICategory) => void;
}

export function CategoryCard({
                               categoryObj,
                               isActive,
                               children,
                               onIconLeftClick
                             }: React.PropsWithChildren<ICategoryCard>) {
  const color = categoriesStore.getCategoryColor(categoryObj._id);

  return (

    <div className={ styles.card }
         style={{ color: isActive ? "white" : color }}>
      <RequireAuth>
        <button
          onClick={ (event) => {
            event.stopPropagation();
            onIconLeftClick(categoryObj);
          } }
        />
      </RequireAuth>
      { categoryObj.name }
    </div>
  );
}
