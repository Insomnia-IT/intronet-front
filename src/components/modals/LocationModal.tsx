import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
} from "@chakra-ui/react";
import React from "react";
import { useState } from "react";
import { useCellState } from "src/helpers/cell-state";
import { categoriesStore } from "src/stores";
import { ModalProps } from ".";

/**
 * Модальное окно, которое позволяет добавлять/редактировать/удалять локации
 */
export const LocationModal: React.FC<ModalProps<InsomniaLocationFull>> = ({
  name,
  description,
  directionId,
  tags,
  x,
  y,
  lat,
  lng,
  ...modalProps
}) => {
  const [location, setLocation] = useState<Partial<InsomniaLocationFull>>({
    name,
    description,
    directionId,
    tags,
    x,
    y,
    lat,
    lng,
  });
  const [categories] = useCellState(categoriesStore);

  return (
    <Modal isOpen={modalProps.show} onClose={modalProps.abort} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Input
            placeholder="Название локации"
            value={location.name}
            onChange={(event) =>
              setLocation((prev) => ({ ...prev, name: event.target.value }))
            }
          />
        </ModalHeader>
        <ModalBody>
          <Textarea
            placeholder="Содержимое локации"
            value={location.description}
            onChange={(event) =>
              setLocation((prev) => ({
                ...prev,
                description: event.target.value,
              }))
            }
            maxLength={255}
            height="xs"
          />
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={modalProps.abort}>
            Отменить
          </Button>
          <Button
            colorScheme="blue"
            onClick={() => modalProps.success(location)}
          >
            Сохранить
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
