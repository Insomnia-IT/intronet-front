import React, { FC } from "preact/compat";
import { useAddCategory, useEditCategory } from "@hooks";
import { BoardList } from "./boardList/boardList";
import Categories from "./categories/categories";
import Header from "./header/header";

export const BoardPage: FC = () => {
  const editCategory = useEditCategory();

  const addCategory = useAddCategory();

  return (
    <div>
      <div>
        <div>
          <Header />
        </div>
        <div >
          <Categories
            onEditCategory={editCategory}
            onAddCategory={addCategory}
          />
        </div>
        <div
          className={" hide-scrollbar"}
        >
          <BoardList />
        </div>
      </div>
    </div>
  );
};
