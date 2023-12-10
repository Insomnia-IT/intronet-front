import {Modal} from "../modal";
import { ModalProps } from "./index";
import { LoginFormToken } from "../forms";
import {Button} from "../index";
import {SvgIcon} from "../../icons";
import {FunctionalComponent} from "preact";
import {useState} from "preact/hooks";

/**
 * Модальное окно, которое позволяет добавлять/редактировать/удалять локации
 */
export const LoginModal: FunctionalComponent<ModalProps<Partial<User>>> = ({
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
          <div >
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
                  Волонтер? Вам сюда <SvgIcon id="#arrow-right" />
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
