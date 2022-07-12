import { Box, HStack, Tab, TabList, Tabs, VStack } from "@chakra-ui/react";
import React, { FC } from "react";
import { Chip } from "src/components/chip/chip";
import { AUDITORY_NAMES, DAYS, DAY_NAMES } from "src/constants";
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
  const show =
    app.auth.username === "admin" ||
    (schedules &&
      schedules.filter(({ locationId: l }) => l === locationId).length > 0);

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
      {show && (
        <Tabs
          colorScheme="teal"
          isFitted
          index={auditory - 1}
          onChange={(index) => {
            // здесь мы точно уверены, что индекс это или 0, или 1
            onAuditoryChange((index + 1) as unknown as 1 | 2);
          }}
        >
          <TabList>
            {(show || auditories.length === 1) && (
              <Tab>{AUDITORY_NAMES[1]}</Tab>
            )}
            {(show || auditories.length === 2) && (
              <Tab>{AUDITORY_NAMES[2]}</Tab>
            )}
          </TabList>
        </Tabs>
      )}
      <VStack mt="4">
        {auditoryElements.map(
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
