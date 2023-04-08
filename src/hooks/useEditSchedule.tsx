import { ScheduleElementModal } from "@components/modals";
import { useAppContext } from "@helpers/AppProvider";
import { scheduleStore } from "@stores/schedule.store";
import {toast} from "@components";
import { useCallback } from "preact/hooks";

/**
 * Хук для редактирования элемента расписания
 * @returns Функция редактирования.
 */
export const useEditSchedule = () => {
  const app = useAppContext();


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

        await scheduleStore.editSchedule(currentSchedule);

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
