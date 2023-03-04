import React, { FC } from "react";
import { useAddCategory, useEditCategory } from "@hooks";
import { BoardList } from "./boardList/boardList";
import Categories from "./categories/categories";
import Header from "./header/header";

export const BoardPage: FC = () => {
  const editCategory = useEditCategory();

  const addCategory = useAddCategory();

  return (
    <div h={"100%"}>
      <div pt={8} align={"flex-start"} spacing={4} w={"100%"} maxH={"100%"}>
        <div>
          <Header />
        </div>
        <div minW={"100%"}>
          <Categories
            onEditCategory={editCategory}
            onAddCategory={addCategory}
          />
        </div>
        <div
          minH={1}
          overflowY={"auto"}
          w={"100%"}
          className={" hide-scrollbar"}
        >
          <BoardList />
        </div>
      </div>
    </div>
  );
};
