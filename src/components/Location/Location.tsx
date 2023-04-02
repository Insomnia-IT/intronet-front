import React, { FC } from "preact/compat";
import { LocationProps } from "./types";
import styles from "./styles.module.css";
import { RequireAuth } from "../RequireAuth";
import { LocationMenu } from "./LocationMenu";
import {
  // useEditSchedule,
  // useAddSchedule,
  // useDeleteSchedule,
  // useEditLocation,
} from "@hooks";
import { LocationScheduleInfo } from "./LocationSchedule/LocationScheduleInfo";
import { useCellState } from "@helpers/cell-state";
import { locationsStore } from "@stores";
import { ConnectedLocationSchedule } from "./LocationSchedule";
import {SvgIcon} from "@icons";
import {Button} from "@components";

export const Location: FC<LocationProps> = ({ location, expanded }) => {
  const editSchedule = (...args) => void 0;//useEditSchedule();

  const addSchedule = (...args) => void 0;//useAddSchedule(location._id);

  const deleteSchedule = (...args) => void 0;//useDeleteSchedule(location._id);

  const editLocation = (...args) => void 0// useEditLocation(location);

  const [menu] = useCellState(
    () => locationsStore.db.get(location._id)?.menu
  );

  return (
    <div className={styles.content}>
      <div className={styles.header}>{location.name}</div>
      <div
        className={expanded ? styles.descriptionExpanded : styles.description}
      >
        {location.description}
      </div>
      <RequireAuth>
        <div >
          <Button aria-label="Edit note" onClick={editLocation}>
            <SvgIcon id="#edit"/>
          </Button>
        </div>
      </RequireAuth>
      {expanded && (
        <>
          <ConnectedLocationSchedule
            locationId={location._id}
            renderScheduleFooter={(props) => (
              <>
                <RequireAuth>
                  <Button onClick={() =>
                      addSchedule(props.schedules, props.day, props.auditory)
                    }>
                    <SvgIcon id="#plus"/>Добавить
                  </Button>
                </RequireAuth>
                {menu && (
                  <div>
                    <LocationMenu description={menu} />
                  </div>
                )}
              </>
            )}
            renderScheduleInfo={(props) => (
              <div>
                <div>
                  <LocationScheduleInfo
                    {...props}
                    key={props.auditoryElement._id}
                  />
                </div>
                <RequireAuth>
                  <Button
                    aria-label="Edit note"
                    onClick={() =>
                      editSchedule(
                        props.schedules,
                        props.auditoryElement,
                        props.day,
                        props.auditory,
                        props.auditoryElementIndex
                      )
                    }
                  ><SvgIcon id="#edit" /></Button>
                  {/*<Popover placement="bottom" closeOnBlur={false}>*/}
                  {/*  <PopoverTrigger>*/}
                  {/*    <IconButton*/}
                  {/*      isRound*/}
                  {/*      icon={<DeleteIcon />}*/}
                  {/*      colorScheme="red"*/}
                  {/*      aria-label="Delete the event"*/}
                  {/*    />*/}
                  {/*  </PopoverTrigger>*/}
                  {/*  <PopoverContent>*/}
                  {/*    <PopoverArrow />*/}
                  {/*    <PopoverCloseButton />*/}
                  {/*    <PopoverBody>*/}
                  {/*      Вы уверены, что хотите удалить событие?*/}
                  {/*    </PopoverBody>*/}
                  {/*    <PopoverFooter>*/}
                  {/*      <Button*/}
                  {/*        colorScheme="red"*/}
                  {/*        onClick={() =>*/}
                  {/*          deleteSchedule(*/}
                  {/*            props.schedules,*/}
                  {/*            props.auditoryElement,*/}
                  {/*            props.day,*/}
                  {/*            props.auditory,*/}
                  {/*            props.auditoryElementIndex*/}
                  {/*          )*/}
                  {/*        }*/}
                  {/*      >*/}
                  {/*        Удалить*/}
                  {/*      </Button>*/}
                  {/*    </PopoverFooter>*/}
                  {/*  </PopoverContent>*/}
                  {/*</Popover>*/}
                </RequireAuth>
              </div>
            )}
          />
        </>
      )}
    </div>
  );
};
