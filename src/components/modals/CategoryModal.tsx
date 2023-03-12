import React, { FC } from "preact/compat";
import { Modal } from "@components/modal";
import { ModalProps } from "@components/modals";
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
      <Modal.Overlay />
      <Modal.Content>
        <Modal.CloseButton />
        <Modal.Header></Modal.Header>
        <Modal.Body>
          <CategoryForm
            category={category}
            onSubmit={modalProps.success}
            onCancel={modalProps.abort}
          />
        </Modal.Body>
        <Modal.Footer />
      </Modal.Content>
    </Modal>
  );
};
