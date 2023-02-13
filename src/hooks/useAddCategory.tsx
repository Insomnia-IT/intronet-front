import { useToast } from "@chakra-ui/react";
import React, { useCallback } from "react";
import { CategoryModal } from "@src/components/modals";
import { useAppContext } from "@src/helpers/AppProvider";
import { categoriesStore } from "@src/stores";

/**
 * Хук для добавляния категорий
 * @returns Функция добавления.
 */
export const useAddCategory = () => {
  const app = useAppContext();

  const toast = useToast();

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
