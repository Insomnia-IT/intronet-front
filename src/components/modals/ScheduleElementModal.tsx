import { Modal } from "@components/modal";
import { FunctionalComponent } from "preact";
import { ModalProps } from ".";
import { ScheduleElementForm } from "../forms";

/**
 * Модальное окно, которое позволяет добавлять/редактировать/удалять объявление
 */
export const ScheduleElementModal: FunctionalComponent<ModalProps<Partial<AuditoryElement>>> = ({
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
      <Modal.Overlay />
      <Modal.Content>
        <Modal.CloseButton />
        <Modal.Header></Modal.Header>
        <Modal.Body>
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
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};
