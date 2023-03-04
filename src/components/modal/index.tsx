import { ResolvablePromise } from "@cmmn/cell/lib";
import { ModalProps } from "@components/modals";
import React from "preact/compat";
import {Modal as BaseModal} from "./modal";
import {Cell} from "@cmmn/cell/lib";
import {useCellState} from "@helpers/cell-state";

const parts = {
  Body: (props: JSX.IntrinsicElements["div"]) => <div {...props}></div>,
  CloseButton: (props: JSX.IntrinsicElements["div"]) => <div {...props}></div>,
  Content: (props: JSX.IntrinsicElements["div"]) => <div {...props}></div>,
  Footer: (props: JSX.IntrinsicElements["div"]) => <div {...props}></div>,
  Header: (props: JSX.IntrinsicElements["div"]) => <div {...props}></div>,
  Overlay: (props: JSX.IntrinsicElements["div"]) => <div {...props}></div>,
  async show<T>(factory: React.FC<ModalProps<T>>): Promise<T>{
    const result = new ResolvablePromise<T>();
    const props: ModalProps = {
      show: true,
      isActive: true,
      success: (res) => {
        result.resolve(res);
        currentModal.set(null);
      },
      abort: e => {
        result.reject(e);
        currentModal.set(null);
      }
    };
    const component = factory(props);
    currentModal.set(component)
    return result;
  }
}

const currentModal = new Cell<React.JSX.Element>(null);

export const ModalSlot: React.FC = () => {
  const [current] = useCellState(() => currentModal.get());
  return current;
}

export const Modal = Object.assign(BaseModal, parts) as typeof BaseModal & typeof parts;
