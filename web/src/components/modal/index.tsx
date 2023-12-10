import { ResolvablePromise } from "@cmmn/core";
import { ModalProps } from "../modals";
import { FunctionalComponent, JSX } from "preact";
import { Modal as BaseModal } from "./modal";
import { Cell } from "@cmmn/cell";
import { useCell } from "../../helpers/cell-state";

const parts = {
  Body: (props: JSX.IntrinsicElements["div"]) => <div {...props}></div>,
  CloseButton: (props: JSX.IntrinsicElements["div"]) => <div {...props}></div>,
  Content: (props: JSX.IntrinsicElements["div"]) => <div {...props}></div>,
  Footer: (props: JSX.IntrinsicElements["div"]) => <div {...props}></div>,
  Header: (props: JSX.IntrinsicElements["div"]) => <div {...props}></div>,
  Overlay: (props: JSX.IntrinsicElements["div"]) => <div {...props}></div>,
  async show<T>(factory: FunctionalComponent<ModalProps<T>>): Promise<T> {
    const result = new ResolvablePromise<T>();
    const props: ModalProps = {
      show: true,
      isActive: true,
      success: (res) => {
        result.resolve(res);
        currentModal.set(null);
      },
      abort: (e) => {
        result.reject(e);
        currentModal.set(null);
      },
    };
    const component = factory(props);
    currentModal.set(component);
    return result;
  },
};

const currentModal = new Cell<JSX.Element>(null);

export const ModalSlot: FunctionalComponent = () => {
  const current = useCell(() => currentModal.get());
  return current;
};

export const Modal = Object.assign(BaseModal, parts) as typeof BaseModal &
  typeof parts;
