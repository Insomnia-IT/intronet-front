import { Box, HStack, VStack } from "@chakra-ui/react";
import React, { FC } from "react";
import { Chip } from "src/components/chip/chip";
import { AUDITORY_NAMES, DAY_NAMES, DAYS } from "src/constants";
import { useAppContext } from "src/helpers/AppProvider";
import styles from "./styles.module.css";
import { LocationScheduleProps } from "./types";

export const LocationSchedule: FC<LocationScheduleProps> = ({
  locationId,
  schedules,
  day,
  onDayChange,
  auditory,
  auditories,
  onAuditoryChange,
  auditoryElements,
  renderScheduleInfo,
  renderScheduleFooter,
  selectedElement,
  onSelectedElementChange,
}) => {
  const app = useAppContext();
  const isAdmin = app.auth.username === "admin";
  const show =
    isAdmin ||
    (schedules &&
      schedules.filter(({ locationId: l }) => l === locationId).length > 0);
  const showAuditories = isAdmin || auditories.length > 1;
  return (
    <div className={styles.content}>
      {show && <header className={styles.header}>Расписание</header>}
      {show && (
        <HStack className={styles.chips}>
          {DAYS.map((d) => {
            return (
              <Chip
                key={d}
                onClick={() => {
                  onDayChange(d);
                  onAuditoryChange(1);
                }}
                active={day === d}
              >
                {DAY_NAMES[d]}
              </Chip>
            );
          })}
        </HStack>
      )}
      {showAuditories && (
        <div className={styles.tags}>
          {(isAdmin ? ([1, 2] as (1 | 2)[]) : auditories).map((a) => {
            return (
              <div
                className={
                  a === auditory ? styles.auditoryActive : styles.auditory
                }
                key={a}
                onClick={() => {
                  onAuditoryChange(a);
                }}
              >
                {AUDITORY_NAMES[a]}
              </div>
            );
          })}
        </div>
      )}
      <VStack mt="4">
        {sortAuditoryElements(auditoryElements).map(
          (auditoryElement: AuditoryElement, index: number) => (
            <Box w="full" key={auditoryElement.id}>
              {renderScheduleInfo?.({
                auditoryElement,
                selected: selectedElement === auditoryElement,
                switchSelection: () => {
                  const isSelected = selectedElement === auditoryElement;
                  onSelectedElementChange(isSelected ? null : auditoryElement);
                },
                schedules: schedules,
                day: day,
                auditory: auditory,
                auditoryElementIndex: index,
              })}
            </Box>
          )
        )}
        {renderScheduleFooter?.({
          schedules: schedules,
          day: day,
          auditory: auditory,
        })}
      </VStack>
    </div>
  );
};

function sortAuditoryElements(elements: AuditoryElement[]) {
  elements.sort((a, b) => {
    const aTimeS = a.time.split(":").map(Number);
    const bTimeS = b.time.split(":").map(Number);
    let aTime = aTimeS[0] * 60 + aTimeS[1];
    let bTime = bTimeS[0] * 60 + bTimeS[1];
    if (aTime < 12 * 60) {
      aTime += 24 * 60;
    }
    if (bTime < 12 * 60) {
      bTime += 24 * 60;
    }
    return aTime - bTime;
  });
  console.log(elements.map((x) => x.time));
  return elements;
}
