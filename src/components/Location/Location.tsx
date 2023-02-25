import React, { FC } from "react";
import { LocationProps } from "./types";
import styles from "./styles.module.css";
import {
  Box,
  Button,
  HStack,
  IconButton,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverFooter,
  PopoverTrigger,
} from "@chakra-ui/react";
import { EditIcon, AddIcon, DeleteIcon } from "@chakra-ui/icons";
import { RequireAuth } from "../RequireAuth";
import { LocationMenu } from "./LocationMenu";
import {
  useEditSchedule,
  useAddSchedule,
  useDeleteSchedule,
  useEditLocation,
} from "@hooks";
import { LocationScheduleInfo } from "./LocationSchedule/LocationScheduleInfo";
import { useCellState } from "@helpers/cell-state";
import { locationsStore } from "@stores/locations.store";
import { ConnectedLocationSchedule } from "./LocationSchedule";

export const Location: FC<LocationProps> = ({ location, expanded }) => {
  const editSchedule = useEditSchedule();

  const addSchedule = useAddSchedule(location._id);

  const deleteSchedule = useDeleteSchedule(location._id);

  const editLocation = useEditLocation(location);

  const [menu] = useCellState(
    () => locationsStore.Locations.get(location._id)?.menu
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
        <Box pos="absolute" right="10px" zIndex="1" bottom="10px">
          <IconButton
            size="lg"
            isRound
            icon={<EditIcon />}
            aria-label="Edit note"
            onClick={editLocation}
          />
        </Box>
      </RequireAuth>
      {expanded && (
        <>
          <ConnectedLocationSchedule
            locationId={location._id}
            renderScheduleFooter={(props) => (
              <>
                <RequireAuth>
                  <Button
                    leftIcon={<AddIcon />}
                    colorScheme="teal"
                    onClick={() =>
                      addSchedule(props.schedules, props.day, props.auditory)
                    }
                  >
                    Добавить
                  </Button>
                </RequireAuth>
                {menu && (
                  <Box alignSelf="flex-start">
                    <LocationMenu description={menu} />
                  </Box>
                )}
              </>
            )}
            renderScheduleInfo={(props) => (
              <HStack>
                <Box w="full">
                  <LocationScheduleInfo
                    {...props}
                    key={props.auditoryElement._id}
                  />
                </Box>
                <RequireAuth>
                  <IconButton
                    size="lg"
                    isRound
                    icon={<EditIcon />}
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
                  />
                  <Popover placement="bottom" closeOnBlur={false}>
                    <PopoverTrigger>
                      <IconButton
                        isRound
                        icon={<DeleteIcon />}
                        colorScheme="red"
                        aria-label="Delete the event"
                      />
                    </PopoverTrigger>
                    <PopoverContent>
                      <PopoverArrow />
                      <PopoverCloseButton />
                      <PopoverBody>
                        Вы уверены, что хотите удалить событие?
                      </PopoverBody>
                      <PopoverFooter>
                        <Button
                          colorScheme="red"
                          onClick={() =>
                            deleteSchedule(
                              props.schedules,
                              props.auditoryElement,
                              props.day,
                              props.auditory,
                              props.auditoryElementIndex
                            )
                          }
                        >
                          Удалить
                        </Button>
                      </PopoverFooter>
                    </PopoverContent>
                  </Popover>
                </RequireAuth>
              </HStack>
            )}
          />
        </>
      )}
    </div>
  );
};
