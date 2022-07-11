import { useToast } from "@chakra-ui/react";
import React, { useCallback } from "react";
import { LocationModal } from "src/components/modals";
import { useAppContext } from "src/helpers/AppProvider";
import { locationsStore } from "src/stores/locations.store";

/**
 * Хук для редактирования локации
 * @returns Функция редактирования.
 */
export const useEditLocation = (location: InsomniaLocation) => {
  const app = useAppContext();

  const toast = useToast();

  return useCallback(async () => {
    try {
      const editedLocation = await app.modals.show<InsomniaLocation>(
        (props) => (
          // @ts-ignore
          <LocationModal {...props} {...location} />
        )
      );
      locationsStore.Locations.update(editedLocation);
      toast({
        title: "Объявление успешно изменено!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "Ошибка изменения объявления.",
          description: error.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  }, [app.modals, location, toast]);
};
