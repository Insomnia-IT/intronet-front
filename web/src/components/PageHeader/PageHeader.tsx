import { ReactNode } from "preact/compat";
import { CloseButton } from "@components";
import styles from "./PageHeader.module.css";

type PageHeaderProps = {
  titleH1?: string;
  titleH2?: string | ReactNode;
  type?: 'h1' | 'h2';
  withCloseButton?: boolean;
  onClose?: () => void;
  align?: 'top' | 'bottom' | 'baseline' | 'center';
  children?: ReactNode | ReactNode[];
};

export const PageHeader = ({titleH1, titleH2, withCloseButton, align, children, onClose }: PageHeaderProps) => {
  return (
    <header className={`${styles.header} ${styles[align]}`}>
      {(() => {
        switch (true) {
          case !!titleH1:
            return <h1>{titleH1}</h1>
          case !!titleH2:
            return <p className={`sh1 ${styles.titleH2}`}>{titleH2}</p>
          default:
            return {children}
        }
      })()}
      {withCloseButton && <CloseButton position="static" onClick={onClose}/>}
    </header>
  )
}
