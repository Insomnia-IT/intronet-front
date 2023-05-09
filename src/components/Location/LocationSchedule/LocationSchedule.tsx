import { FunctionalComponent } from "preact";
import { Chip } from "@components/chip/chip";
import { AUDITORY_NAMES, DAY_NAMES, DAYS } from "@constants";
import { useAppContext } from "@helpers/AppProvider";
import styles from "./styles.module.css";
import { LocationScheduleProps } from "./types";
import {useCell} from "@helpers/cell-state";
import {authStore} from "@stores/auth.store";

export const LocationSchedule: FunctionalComponent<LocationScheduleProps> = ({
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
  const isAdmin = useCell(() => authStore.isAdmin);
  const show =
    isAdmin ||
    (schedules &&
      schedules.filter(({ locationId: l }) => l === locationId).length > 0);
  const showAuditories = isAdmin || auditories.length > 1;
  return (
    <div className={styles.content}>
      {show && <header className={styles.header}>Расписание</header>}
      {/*{show && (*/}
      {/*  <div className={styles.chips}>*/}
      {/*    {DAYS.map((d) => {*/}
      {/*      return (*/}
      {/*        <Chip*/}
      {/*          key={d}*/}
      {/*          onClick={() => {*/}
      {/*            onDayChange(d);*/}
      {/*            onAuditoryChange(1);*/}
      {/*          }}*/}
      {/*          active={day === d}*/}
      {/*        >*/}
      {/*          {DAY_NAMES[d]}*/}
      {/*        </Chip>*/}
      {/*      );*/}
      {/*    })}*/}
      {/*  </div>*/}
      {/*)}*/}
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
      <div>
        {sortAuditoryElements(auditoryElements).map(
          (auditoryElement: AuditoryElement, index: number) => (
            <div key={auditoryElement._id}>
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
            </div>
          )
        )}
        {renderScheduleFooter?.({
          schedules: schedules,
          day: day,
          auditory: auditory,
        })}
      </div>
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
  return elements;
}
