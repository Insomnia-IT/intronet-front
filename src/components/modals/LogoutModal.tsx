import React, { FC } from "preact/compat";
import { Button } from "@components";
import { Modal } from "@components/modal";
import { ModalProps } from "@components/modals";

export const LogoutModal: FC<ModalProps<Partial<User>>> = ({
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
          <>
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
          </>
        </Modal.Body>
        <Modal.Footer />
      </Modal.Content>
    </Modal>
  );
};
