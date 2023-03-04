import {toast} from "@components";
import React, { useCallback } from "preact/compat";
import { ScheduleElementModal } from "@components/modals";
import { useAppContext } from "@helpers/AppProvider";
import { scheduleStore } from "@stores/schedule.store";

/**
 * Хук для создания элемента расписания
 * @returns Функция создания.
 */
export const useAddSchedule = (locationId: Schedule["locationId"]) => {
  const app = useAppContext();

  return useCallback(
    async (
      schedules?: Schedule[],
      day?: Day,
      auditory?: Auditory["number"]
    ) => {
      try {
        // показываем модальное окно для создания одного элемента расписания в аудитории `AuditoryElement`
        const editedAuditoryElement = await app.modals.show<
          Partial<AuditoryElement>
        >((props) => <ScheduleElementModal {...props} />);

        const currentSchedule =
          scheduleStore.getSchedule(locationId, day) ??
          ({
            locationId,
            day,
            audiences: [],
            _id: undefined,
          } as Schedule);

        const audience =
          currentSchedule.audiences.find((x) => x.number === auditory) ??
          (() => {
            const res = {
              elements: [],
              number: auditory,
            };
            currentSchedule.audiences.push(res);
            return res;
          })();

        audience.elements.push(editedAuditoryElement);

        await scheduleStore.editSchedule(currentSchedule);

        toast({
          title: "Событие успешно создано!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        if (error instanceof Error) {
          toast({
            title: "Ошибка создания события.",
            description: error.message,
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      }
    },
    [app.modals, locationId, toast]
  );
};
