import { ReactNode } from "preact/compat";
import { SvgIcon } from "@icons";
import { goTo, RoutePath, RoutePathString } from "../../pages/routing";
import { CloseButton } from "@components";
import styles from "./PageHeader.module.css";
import {FunctionalComponent} from "preact";

type PageHeaderProps = {
  titleH1?: string;
  titleH2?: string | ReactNode;
  type?: 'h1' | 'h2';
  favoritesRoute?: RoutePath | RoutePathString;
  withCloseButton?: boolean;
  onClose?: () => void;
  align?: 'top' | 'bottom' | 'baseline' | 'center';
  children?: ReactNode | ReactNode[];
};

export const PageHeader = ({titleH1, titleH2, favoritesRoute, withCloseButton, align, children, onClose }: PageHeaderProps) => {
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

      {Boolean(favoritesRoute) && (
        <SvgIcon
          id="#bookmark"
          style={{ color: "var(--pink)" }}
          size={32}
          onClick={() => goTo(favoritesRoute)}
        />
      )}
      {withCloseButton && <CloseButton position="static" onClick={onClose}/>}
    </header>
  )
}
