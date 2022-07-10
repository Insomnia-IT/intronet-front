import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import React, { FC } from "react";
import { ModalProps } from ".";
import { NoteForm } from "../forms";

/**
 * Модальное окно, которое позволяет добавлять/редактировать/удалять объявление
 * @param title Название объявления
 * @param text Содержимое объявления
 */
export const NoteModal: FC<
  ModalProps<Omit<Omit<INote, "createdDate">, "createdBy">>
> = ({ id, title, text, categoryId, ...modalProps }) => {
  return (
    <Modal
      isOpen={modalProps.show}
      onClose={modalProps.abort}
      scrollBehavior="outside"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalHeader></ModalHeader>
        <ModalBody>
          <NoteForm
            note={{
              text,
              title,
              categoryId,
              id,
            }}
            onSubmit={modalProps.success}
            onCancel={modalProps.abort}
          />
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
};
