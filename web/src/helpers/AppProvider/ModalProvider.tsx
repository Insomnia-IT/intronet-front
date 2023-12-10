import {
  createContext,
  JSX,
} from "preact";
import { ModalProps } from "../../components/modals";
import {useCallback, useContext, useState} from "preact/hooks";

export const ModalContext = createContext<{
  modal: JSX.Element;
  show: <T = any>(
    callback: (props: ModalProps<T>) => JSX.Element
  ) => Promise<T>;
  hide: () => void;
}>({
  hide: () => {},
  modal: null,
  show: async () => null,
});

export type ModalProviderProps = JSX.ElementChildrenAttribute & {
};

export const ModalProvider = ({
  children,
}: ModalProviderProps) => {
  const [modal, setModal] = useState<JSX.Element>(null);

  const [isActive, setIsActive] = useState(false);

  const hide = useCallback(() => {
    setIsActive(false);
    setModal(null);
  }, []);

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
        throw error;
      }
    },
    [hide]
  );

  return (
    <ModalContext.Provider
      value={{
        modal,
        // @ts-ignore
        show,
        hide,
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModalContext = () => useContext(ModalContext);
