import React, { useEffect, useRef } from "react";
import {
  Modal,
  Media,
  Content,
  Button,
  Image,
  Card,
} from "react-bulma-components";
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
      <Card>
        <Card.Header>
          <Card.Header.Title>{props.name}</Card.Header.Title>
        </Card.Header>
        <Card.Content>
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
        </Card.Content>
        <Card.Footer>
          <Button color="success" onClick={props.success}>
            Сохранить
          </Button>
          <Button onClick={props.abort}>Отмена</Button>
        </Card.Footer>
      </Card>
    </Modal>
  );
};
