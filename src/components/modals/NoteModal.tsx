import { Modal } from "@components/modal";
import React, { FC } from "preact/compat";
import { ModalProps } from ".";
import { NoteForm } from "../forms";

/**
 * Модальное окно, которое позволяет добавлять/редактировать/удалять объявление
 * @param title Название объявления
 * @param text Содержимое объявления
 */
export const NoteModal: FC<
  ModalProps<Omit<Omit<INote, "createdDate">, "createdBy">>
> = ({ _id, title, text, categoryId, ...modalProps }) => {
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
          <NoteForm
            note={{
              text,
              title,
              categoryId,
              _id: _id,
            }}
            onSubmit={(note) => modalProps.success(note)}
            onCancel={modalProps.abort}
          />
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};
