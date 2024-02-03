import { FunctionalComponent } from "preact";
import { PropsWithChildren, ReactNode } from "preact/compat";
import cn from 'classnames';
import { TapBar } from "@components/TapBar";
import styles from './PageLayout.module.css';
import { ButtonsBar } from "@components";

export type PageLayoutProps = PropsWithChildren<{
  design?: 'light' | 'dark';
  withTapBar?: boolean;
  buttons?: ReactNode;
  className?: string;
  /* Если true, у контейнера не будет стилей */
  clear?: boolean;
}>

export const PageLayout: FunctionalComponent<PageLayoutProps> = ({
  design = 'light',
  withTapBar,
  buttons,
  className= '',
  clear,
  children,
}) => {
  return (
    <div
      className={cn(
        styles.layout,
        styles[design],
        clear && styles.clear,
        withTapBar && styles.withTapbar,
        className
      )}
    >
      {children}
      {Boolean(buttons) && (
        <ButtonsBar at='bottomWithTapbar'>
          {buttons}
        </ButtonsBar>
      )}
      {withTapBar && <TapBar />}
    </div>
  );
}
