import { FunctionalComponent } from "preact";
import { PropsWithChildren } from "preact/compat";
import cn from 'classnames';
import { TapBar } from "@components/TapBar";
import styles from './styles.module.css';

export type PageLayoutProps = PropsWithChildren<{
  design?: 'light' | 'dark';
  withTapBar?: boolean;
  className?: string;
  /* Если true, у контейнера не будет стилей */
  clear?: boolean;
}>

export const PageLayout: FunctionalComponent<PageLayoutProps> = ({
  design = 'light',
  withTapBar,
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
        withTapBar && styles['with-tapbar'],
        className
      )}
    >
      {children}
      {withTapBar && <TapBar />}
    </div>
  );
}
