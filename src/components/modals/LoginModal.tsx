import {Modal} from "@components/modal";
import React, { FC, useState } from "react";
import { ModalProps } from ".";
import { LoginFormToken } from "../forms/LoginFormToken";
import {Button} from "@components";
import { Icons } from "@icons";

/**
 * Модальное окно, которое позволяет добавлять/редактировать/удалять локации
 */
export const LoginModal: FC<ModalProps<Partial<User>>> = ({
  token,
  ticketId,
  ...modalProps
}) => {
  const [loginMethod, setLoginMethod] = useState<"ticketId" | "token">("token");
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
          <div spacing={5}>
            {loginMethod === "ticketId" && (
              <>
                {/*<LoginFormTicket*/}
                {/*  onSubmit={(newTicketId) =>*/}
                {/*    modalProps.success({ ticketId: newTicketId })*/}
                {/*  }*/}
                {/*  ticketId={ticketId}*/}
                {/*/>*/}
                <Button
                  onClick={() => setLoginMethod("token")}
                >
                  Волонтер? Вам сюда <Icons.ArrowRight />
                </Button>
              </>
            )}
            {loginMethod === "token" && (
              <>
                <LoginFormToken
                  token={token}
                  onSubmit={(newToken) =>
                    modalProps.success({ token: newToken })
                  }
                />
                {/* <Button
                  rightIcon={<ArrowForwardIcon />}
                  colorScheme="blue"
                  variant="link"
                  onClick={() => setLoginMethod("ticketId")}
                >
                  Не волонтер? Вам сюда
                </Button> */}
              </>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal.Content>
    </Modal>
  );
};
