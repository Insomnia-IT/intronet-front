import { useToast } from "@chakra-ui/react";
import React, { useCallback } from "react";
import { ScheduleElementModal } from "src/components/modals";
import { DAYS } from "src/constants";
import { useAppContext } from "src/helpers/AppProvider";
import { scheduleStore } from "src/stores/schedule.store";

/**
 * Хук для создания элемента расписания
 * @returns Функция создания.
 */
export const useAddSchedule = (locationId: Schedule["locationId"]) => {
  const app = useAppContext();

  const toast = useToast();

  return useCallback(
    async (
      schedules?: Schedule[],
      day?: Day,
      auditory?: Auditory["number"]
    ) => {
      schedules ??= {
        // @ts-ignore
        id: 0,
        audiences: [
          { number: 1, elements: [] },
          { number: 2, elements: [] },
        ],
        // @ts-ignore
        day: DAYS.findIndex((d) => d === day),
        locationId,
      };

      try {
        // показываем модальное окно для создания одного элемента расписания в аудитории `AuditoryElement`
        const editedAuditoryElement = await app.modals.show<
          Partial<AuditoryElement>
        >((props) => <ScheduleElementModal {...props} />);

        // отбираем текущий элемент расписания `Schedule` по выбранному дню
        const currentSchedule = {
          ...schedules.filter(({ day: scheduleDay }) => day === scheduleDay)[0],
        };

        currentSchedule.audiences[auditory - 1].elements.push(
          // @ts-ignore
          editedAuditoryElement
        );

        await scheduleStore.editSchedule({
          ...currentSchedule,
          // @ts-ignore
          day: DAYS.findIndex((d) => d === day),
          // @ts-ignore
          id: parseInt(currentSchedule.id[0]),
          locationId,
        });

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
