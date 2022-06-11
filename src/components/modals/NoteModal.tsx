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
import React, { useState } from "react";
import { ModalProps } from ".";

/**
 * Модальное окно, которое позволяет добавлять/редактировать/удалять объявление
 * @param title Название объявления
 * @param text Содержимое объявления
 */
export const NoteModal: React.FC<ModalProps<Pick<INote, "text" | "title">>> = ({
  title,
  text,
  ...modalProps
}) => {
  const [newTitle, setNewTitle] = useState(title);
  const [newText, setNewText] = useState(text);

  return (
    <Modal isOpen={modalProps.show} onClose={modalProps.abort} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Input
            placeholder="Название объявления"
            value={newTitle}
            onChange={(event) => setNewTitle(event.target.value)}
          />
        </ModalHeader>
        <ModalBody>
          <Textarea
            placeholder="Содержимое объявления"
            value={newText}
            onChange={(event) => setNewText(event.target.value)}
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
            onClick={() =>
              modalProps.success({ title: newTitle, text: newText })
            }
          >
            Сохранить
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
