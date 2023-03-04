import { Modal } from "@components/modal";
import React, { FC } from "react";
import { ModalProps } from ".";
import { CategoriesForm } from "../forms";

/**
 * Модальное окно, которое позволяет добавлять/редактировать/удалять тэги
 */
export const CategoriesModal: FC<ModalProps<{ categories: ICategory[] }>> = ({
  categories,
  ...modalProps
}) => {
  return (
    <Modal
      isOpen={modalProps.show}
      onClose={modalProps.abort}
      scrollBehavior="outside"
    >
      <Modal.Overlay />
      <Modal.Content>
        <Modal.CloseButton />
        <Modal.Header></Modal.Header>
        <Modal.Body>
          <CategoriesForm
            categories={categories}
            onSubmit={modalProps.success}
            onCancel={modalProps.abort}
          />
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};
