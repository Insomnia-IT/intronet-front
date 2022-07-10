import {
  Button,
  Heading,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  VStack,
} from "@chakra-ui/react";
import * as React from "react";
import { FC } from "react";
import { ModalProps } from "src/components/modals";

export const LogoutModal: FC<ModalProps<Partial<User>>> = ({
  token,
  ticketId,
  ...modalProps
}) => {
  return (
    <Modal isOpen={modalProps.show} onClose={modalProps.abort}>
      <ModalOverlay></ModalOverlay>
      <ModalContent>
        <ModalCloseButton />
        <ModalHeader></ModalHeader>
        <ModalBody>
          <VStack spacing={5}>
            <Heading fontSize={"3xl"}>Уверены, что хотите выйти?</Heading>
            <VStack spacing={3} width={"100%"} align={"stretch"}>
              <Button
                bg={"blue.400"}
                color={"white"}
                _hover={{
                  bg: "blue.500",
                }}
                onClick={() => modalProps.success(true)}
              >
                Да
              </Button>
              <Button
                bg={"red.500"}
                color={"white"}
                _hover={{
                  bg: "red.600",
                }}
                onClick={modalProps.abort}
              >
                Нет
              </Button>
            </VStack>
          </VStack>
        </ModalBody>
        <ModalFooter />
      </ModalContent>
    </Modal>
  );
};
