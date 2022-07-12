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
import { CategoryForm } from "../forms";

/**
 * Модальное окно, которое позволяет добавлять/редактировать/удалять тэги
 */
export const CategoryModal: FC<
  ModalProps<Partial<{ category: ICategory }>>
> = ({ category, ...modalProps }) => {
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
          <CategoryForm
            category={category}
            onSubmit={modalProps.success}
            onCancel={modalProps.abort}
          />
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
};
