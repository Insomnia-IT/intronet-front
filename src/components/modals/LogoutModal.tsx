import {Modal} from "@components/modal";
import { FunctionalComponent } from "preact";
import { ModalProps } from "@components/modals";
import {Button} from "@components";

export const LogoutModal: FunctionalComponent<ModalProps<Partial<User>>> = ({
  token,
  ticketId,
  ...modalProps
}) => {
  return (
    <Modal isOpen={modalProps.show} onClose={modalProps.abort}>
      <Modal.Overlay></Modal.Overlay>
      <Modal.Content>
        <Modal.CloseButton />
        <Modal.Header></Modal.Header>
        <Modal.Body>
          <div>
            <div>Уверены, что хотите выйти?</div>
            <div width={"100%"} >
              <Button
                onClick={() => modalProps.success(true)}
              >
                Да
              </Button>
              <Button
                onClick={modalProps.abort}
              >
                Нет
              </Button>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer />
      </Modal.Content>
    </Modal>
  );
};
