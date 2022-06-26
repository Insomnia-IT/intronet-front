import { ArrowForwardIcon } from "@chakra-ui/icons";
import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  VStack,
} from "@chakra-ui/react";
import React, { FC, useState } from "react";
import { ModalProps } from ".";
import { LoginFormTicket, LoginFormToken } from "../forms";

/**
 * Модальное окно, которое позволяет добавлять/редактировать/удалять локации
 */
export const LoginModal: FC<ModalProps<Partial<User>>> = ({
  token,
  ticketId,
  ...modalProps
}) => {
  const [loginMethod, setLoginMethod] = useState<"ticketId" | "token">(
    "ticketId"
  );
  return (
    <Modal
      isOpen={modalProps.show}
      onClose={modalProps.abort}
      scrollBehavior="outside"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />
        <ModalHeader></ModalHeader>
        <ModalBody>
          <VStack spacing={5}>
            {loginMethod === "ticketId" && (
              <>
                <LoginFormTicket
                  onSubmit={(newTicketId) =>
                    modalProps.success({ ticketId: newTicketId })
                  }
                  ticketId={ticketId}
                />
                <Button
                  rightIcon={<ArrowForwardIcon />}
                  colorScheme="blue"
                  variant="link"
                  onClick={() => setLoginMethod("token")}
                >
                  Волонтер? Вам сюда
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
                <Button
                  rightIcon={<ArrowForwardIcon />}
                  colorScheme="blue"
                  variant="link"
                  onClick={() => setLoginMethod("ticketId")}
                >
                  Не волонтер? Вам сюда
                </Button>
              </>
            )}
          </VStack>
        </ModalBody>
        <ModalFooter></ModalFooter>
      </ModalContent>
    </Modal>
  );
};
