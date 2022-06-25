import { EditIcon } from "@chakra-ui/icons";
import { Box, IconButton, useToast } from "@chakra-ui/react";
import React, { useState } from "react";
import { LocationModal } from "src/components";
import { useAppContext } from "src/helpers/AppProvider";
import { locationsStore } from "src/stores/locations.store";
import { Close } from "../../../components/close";
import { Expander } from "../../../components/expander";
import styles from "./map-toolbar.module.css";
import { ScheduleComponent } from "./schedule";

export type MapToolbarProps = {
  id: number | string;
  onClose();
};

export function MapToolbar(props: MapToolbarProps) {
  const [expanded, setExpanded] = useState(false);
  const [location] = useState(locationsStore.Locations.get(props.id));

  const app = useAppContext();

  const toast = useToast();

  const handleEditIconButtonClick = async () => {
    try {
      const editedLocation = await app.modals.show<InsomniaLocationFull>(
        (props) => (
          // @ts-ignore
          <LocationModal {...props} {...location} />
        )
      );
      locationsStore.updateLocation(editedLocation);
      toast({
        title: "Объявление успешно изменено!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "Ошибка изменения объявления.",
          description: error.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };
  return (
    <>
      <div className={expanded ? styles.expandedToolbar : styles.toolbar}>
        <div className={styles.close} onClick={props.onClose}>
          <Close />
        </div>
        <div
          className={expanded ? styles.down : styles.up}
          onClick={() => setExpanded((x) => !x)}
        >
          <Expander />
        </div>
        <div className={styles.content}>
          <div className={styles.header}>{location.name}</div>
          <div className={styles.description}>{location.description}</div>
          {expanded && (
            <>
              <ScheduleComponent locationId={location.id} />
              <Box pos="absolute" right="12" zIndex="1" bottom="12">
                <IconButton
                  size="lg"
                  isRound
                  icon={<EditIcon />}
                  aria-label="Edit note"
                  onClick={handleEditIconButtonClick}
                />
              </Box>
            </>
          )}
        </div>
      </div>
    </>
  );
}
