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
import { ScheduleElementForm } from "../forms";

/**
 * Модальное окно, которое позволяет добавлять/редактировать/удалять объявление
 */
export const ScheduleElementModal: FC<ModalProps<Partial<AuditoryElement>>> = ({
  _id,
  name,
  description,
  changes,
  isCanceled,
  speaker,
  time,
  ...modalProps
}) => {
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
          <ScheduleElementForm
            auditoryElement={{
              _id: _id,
              name,
              description,
              changes,
              isCanceled,
              speaker,
              time,
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
