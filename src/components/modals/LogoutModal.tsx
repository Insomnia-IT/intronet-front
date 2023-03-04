import {Modal} from "@components/modal";
import * as React from "react";
import { FC } from "react";
import { ModalProps } from "@components/modals";
import {Button} from "@components";

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
          <div spacing={5}>
            <div fontSize={"3xl"}>Уверены, что хотите выйти?</div>
            <div spacing={3} width={"100%"} align={"stretch"}>
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
