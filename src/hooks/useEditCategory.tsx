import React, { useCallback } from "preact/compat";
import { CategoryModal } from "@components/modals";
import { useAppContext } from "@helpers/AppProvider";
import { categoriesStore } from "@stores";
import {toast} from "@components";

/**
 * Хук для редактирования категории
 * @returns Функция редактирования.
 */
export const useEditCategory = () => {
  const app = useAppContext();

  return useCallback(
    async (category: ICategory) => {
      try {
        const editedCategory = await app.modals.show<ICategory>((props) => (
          <CategoryModal {...props} category={category} />
        ));
        await categoriesStore.editCategory({
          body: editedCategory,
        });
        toast({
          title: "Категория успешно изменена!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        if (error instanceof Error) {
          toast({
            title: "Ошибка изменения категории.",
            description: error.message,
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      }
    },
    [app.modals, toast]
  );
};
