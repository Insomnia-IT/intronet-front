import { Modal } from "@components/modal";
import { FunctionalComponent } from "preact";
import { ModalProps } from ".";
import { NoteForm } from "../forms";

/**
 * Модальное окно, которое позволяет добавлять/редактировать/удалять объявление
 * @param title Название объявления
 * @param text Содержимое объявления
 *
 * @deprecated
 */
export const NoteModal: FunctionalComponent<
  ModalProps<Omit<Omit<INote, "createdDate">, "createdBy">>
> = ({ _id, title, text, categoryId, ...modalProps }) => {
  return null;
  // return (
  // <Modal
  //   isOpen={modalProps.show}
  //   onClose={modalProps.abort}
  //   scrollBehavior="outside"
  // >
  //   <Modal.Overlay />
  //   <Modal.Content>
  //     <Modal.CloseButton />
  //     <Modal.Header></Modal.Header>
  //     <Modal.Body>
  //       <NoteForm
  //         note={{
  //           text,
  //           title,
  //           categoryId,
  //           _id: _id,
  //         }}
  //         onSubmit={modalProps.success}
  //         onCancel={modalProps.abort}
  //       />
  //     </Modal.Body>
  //     <Modal.Footer></Modal.Footer>
  //   </Modal.Content>
  // </Modal>
  // );
};
