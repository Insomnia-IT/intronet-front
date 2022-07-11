import { useToast } from "@chakra-ui/react";
import React, { useCallback } from "react";
import { ScheduleElementModal } from "src/components/modals";
import { DAYS } from "src/constants";
import { useAppContext } from "src/helpers/AppProvider";
import { scheduleStore } from "src/stores/schedule.store";

/**
 * Хук для редактирования элемента расписания
 * @returns Функция редактирования.
 */
export const useEditSchedule = () => {
  const app = useAppContext();

  const toast = useToast();

  return useCallback(
    async (
      schedules?: Schedule[],
      auditoryElement?: AuditoryElement,
      day?: Day,
      auditory?: Auditory["number"],
      auditoryElementIndex?: number
    ) => {
      try {
        // показываем модальное окно для редактирования одного элемента расписания в аудитории `AuditoryElement`
        const editedAuditoryElement = await app.modals.show<
          Partial<AuditoryElement>
        >((props) => <ScheduleElementModal {...props} {...auditoryElement} />);

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
          ...editedAuditoryElement,
        };

        await scheduleStore.editSchedule({
          ...currentSchedule,
          // @ts-ignore
          day: DAYS.findIndex((d) => d === day),
          // @ts-ignore
          id: parseInt(currentSchedule.id[0]),
        });

        toast({
          title: "Событие успешно изменено!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      } catch (error) {
        if (error instanceof Error) {
          toast({
            title: "Ошибка изменения события.",
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
