import { Modal } from "@components/modal";
import { FunctionalComponent } from "preact";
import { ModalProps } from ".";
import { CategoryForm } from "../forms";

/**
 * Модальное окно, которое позволяет добавлять/редактировать/удалять тэги
 */
export const CategoryModal: FunctionalComponent<
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
        <Modal.Footer></Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};
