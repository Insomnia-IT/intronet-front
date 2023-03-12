import React, { useCallback } from "preact/compat";
import { LocationModal } from "@components/modals";
import { useAppContext } from "@helpers/AppProvider";
import { locationsStore } from "@stores/locations.store";
import {toast} from "@components";

/**
 * Хук для редактирования локации
 * @returns Функция редактирования.
 */
export const useEditLocation = (location: InsomniaLocation) => {
  const app = useAppContext();


  return useCallback(async () => {
    try {
      const editedLocation = await app.modals.show<InsomniaLocation>(
        (props) => (
          // @ts-ignore
          <LocationModal {...props} {...location} />
        )
      );
      locationsStore.db.update(editedLocation);
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
