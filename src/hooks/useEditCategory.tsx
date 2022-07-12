import { useToast } from "@chakra-ui/react";
import React, { useCallback } from "react";
import { CategoryModal } from "src/components/modals";
import { useAppContext } from "src/helpers/AppProvider";
import { categoriesStore } from "src/stores";

/**
 * Хук для редактирования категории
 * @returns Функция редактирования.
 */
export const useEditCategory = () => {
  const app = useAppContext();

  const toast = useToast();

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
