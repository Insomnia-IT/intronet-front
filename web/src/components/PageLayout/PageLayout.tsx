import { FunctionalComponent } from "preact";
import { PropsWithChildren, ReactNode } from "preact/compat";
import cn from 'classnames';
import { TapBar } from "@components/TapBar";
import styles from './PageLayout.module.css';
import { ButtonsBar, CloseButton } from "@components";
import { SvgIcon } from "@icons";
import { goTo, RoutePath, RoutePathString, useRouter } from "../../pages/routing";

export type PageLayoutProps = PropsWithChildren<{
  design?: 'light' | 'dark';
  title?: string;
  /* При наличии добавит к заколовку переход в Избранное */
  favoritesRoute?: RoutePath | RoutePathString;
  withTapBar?: boolean;
  withCloseButton?: boolean;
  /* Кнопки, которые будут помещены в ButtonsBar */
  buttons?: ReactNode;
  /* Если true, у контейнера не будет стилей */
  dropStyles?: boolean;
  className?: string;
}>

export const PageLayout: FunctionalComponent<PageLayoutProps> = ({
  design = 'light',
  title,
  favoritesRoute,
  withCloseButton,
  withTapBar,
  buttons,
  className= '',
  dropStyles,
  children,
}) => {
  return (
    <div
      className={cn(
        styles.layout,
        styles[design],
        dropStyles && styles.clear,
        withTapBar && styles.withTapbar,
        className
      )}
    >
      <div className={styles.header}>
        <h1>{title}</h1>
        {Boolean(favoritesRoute) &&  <SvgIcon id='#favorites' size={32} onClick={() => goTo(favoritesRoute)} />}
        {withCloseButton && <CloseButton position='static' />}
      </div>
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
