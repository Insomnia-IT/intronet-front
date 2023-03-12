import React, { FC } from "preact/compat";
import { useAddCategory, useEditCategory } from "@hooks";
import { BoardList } from "./boardList/boardList";
import { Header } from "./header/header";
import Categories  from "./categories/categories";

export const BoardPage: FC = () => {
  const editCategory = useEditCategory();

  const addCategory = useAddCategory();

  return (
    <div>
      <Header/>

      <Categories
        onEditCategory={ editCategory }
        onAddCategory={ addCategory }
      />

      <div className={ "hide-scrollbar" } >
        <BoardList/>
      </div>
    </div>
  );
};
