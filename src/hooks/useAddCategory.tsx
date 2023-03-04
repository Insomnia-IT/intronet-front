import {toast} from "@components";
import React, { useCallback } from "react";
import { useAppContext } from "@helpers/AppProvider";
import { categoriesStore } from "@stores";
import {CategoryModal} from "@components/modals";

/**
 * Хук для добавляния категорий
 * @returns Функция добавления.
 */
export const useAddCategory = () => {
  const app = useAppContext();

  return useCallback(async () => {
    try {
      const editedCategory = await app.modals.show<ICategory>((props) => (
        <CategoryModal {...props} />
      ));
      await categoriesStore.addCategory({
        body: editedCategory,
      });
      toast({
        title: "Категория успешно добавлена!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "Ошибка добавления категории.",
          description: error.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  }, [app.modals, toast]);
};
