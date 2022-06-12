import React, {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useState,
} from "react";
import { ModalProps } from "../../../components/modals";

const ModalContext = createContext<{
  modal: JSX.Element;
  show: <T = any>(
    callback: (props: ModalProps<T>) => JSX.Element
  ) => Promise<T>;
  hide: () => void;
  // @ts-ignore
}>({});

export type ModalProviderProps = {};

export const ModalProvider = ({
  children,
}: PropsWithChildren<ModalProviderProps>) => {
  const [modal, setModal] = useState<JSX.Element>(null);

  const [isActive, setIsActive] = useState(false);

  const show = useCallback(
    async (callback: (props: ModalProps) => JSX.Element) => {
      setIsActive(true);
      try {
        const response = await new Promise((resolve, reject) => {
          setModal(
            callback({
              show: true,
              success: (value) => {
                resolve(value);
                hide();
              },
              abort: () => {
                reject();
                hide();
              },
            })
          );
        });
        return response;
      } catch (error) {
        return error;
      }
    },
    []
  );

  const hide = useCallback(() => {
    setIsActive(false);
    setModal(null);
  }, []);

  return (
    <ModalContext.Provider
      value={{
        modal,
        show,
        hide,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModalContext = () => useContext(ModalContext);
