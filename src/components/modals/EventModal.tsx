import React from "react";
import { Modal, Media, Content, Button, Image } from "react-bulma-components";
import { ModalProps } from ".";

export const EventModal = (props: ModalProps & InsomniaLocation) => {
  return (
    <Modal
      {...props}
      show={props.show}
      closeOnEsc
      closeOnBlur
      onClose={props.abort}
      showClose={false}
    >
      <Modal.Card>
        <Modal.Card.Header>
          <Modal.Card.Title>{props.name}</Modal.Card.Title>
        </Modal.Card.Header>
        <Modal.Card.Body>
          <Media>
            <Media.Item align="left" renderAs="figure">
              <Image alt="64x64" size={64} src={props.image} />
            </Media.Item>
            <Media.Item>
              <Content>
                <p>
                  <strong>John Smith</strong> <small>@johnsmith</small>{" "}
                  <small>31m</small>
                  <br />
                  {props.description}
                </p>
              </Content>
            </Media.Item>
          </Media>
        </Modal.Card.Body>
        <Modal.Card.Footer>
          <Button color="success" onClick={props.success}>
            Сохранить
          </Button>
          <Button onClick={props.abort}>Отмена</Button>
        </Modal.Card.Footer>
      </Modal.Card>
    </Modal>
  );
};
