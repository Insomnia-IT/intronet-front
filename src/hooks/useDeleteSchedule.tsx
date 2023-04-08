import {toast} from "@components";
import { useCallback } from "preact/hooks";
import { scheduleStore } from "@stores/schedule.store";

/**
 * Хук для удаления элемента расписания
 * @returns Функция удаления.
 */
export const useDeleteSchedule = (locationId: Schedule["locationId"]) => {

  return useCallback(
    async (
      schedules?: Schedule[],
      auditoryElement?: AuditoryElement,
      day?: Day,
      auditory?: Auditory["number"],
      auditoryElementIndex?: number
    ) => {
      try {
        // отбираем текущий элемент расписания `Schedule` по выбранному дню
        const currentSchedule = {
          ...schedules.filter(({ day: scheduleDay }) => day === scheduleDay)[0],
        };

        // находим индекс текущей выбранной аудитории
        const editedAuidenceIndex = currentSchedule.audiences.findIndex(
          ({ number }) => auditory === number
        );

        // элементу аудитории текущего расписания по выбранному дня
        // присваеваем измененные данные из модалки
        currentSchedule.audiences[editedAuidenceIndex].elements[
          auditoryElementIndex
        ] = {
          ...auditoryElement,
          // @ts-ignore
          isDeleted: true,
        };
        // await scheduleStore.editSchedule({
        //   ...currentSchedule,
        //   // @ts-ignore
        //   day: DAYS.findIndex((d) => d === day),
        //   // @ts-ignore
        //   id: parseInt(currentSchedule.id[0]),
        //   locationId,
        // });

        await scheduleStore.editSchedule(currentSchedule);

        toast({
          title: "Событие успешно удалено!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        if (error instanceof Error) {
          toast({
            title: "Ошибка удаления события.",
            description: error.message,
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        }
      }
    },
    [locationId, toast]
  );
};
