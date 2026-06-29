import { FunctionalComponent } from "preact";
import { CSSProperties, PropsWithChildren, ReactNode } from "preact/compat";
import cn from "classnames";
import { TapBar } from "@components/TapBar";
import styles from "./PageLayout.module.css";
import { ButtonsBar, CloseButton, Sheet } from "@components";
import {
  RoutePath,
  RoutePathString,
  useRouter,
} from "../../pages/routing";
import { useEffect, useState } from "preact/hooks";
import { SearchInput } from "@components/input/search-input";
import { SearchButton } from "@components/buttons/search-button";

export type PageLayoutProps = PropsWithChildren<{
  design?: "light" | "dark" | "full";
  title?: ReactNode;
  /* При наличии добавит к заколовку переход в Избранное */
  withTapBar?: boolean;
  withCloseButton?: boolean;
  /* Кнопки, которые будут помещены в ButtonsBar */
  buttons?: ReactNode;
  /* Если true, у контейнера не будет стилей */
  dropStyles?: boolean;
  className?: string;
  search?: FunctionalComponent;
  searchStyle?: CSSProperties;
  hideSearchDeps?: any[];
  searchLabel?: string;
  headerStyle?: string;
  gap?: number | string;
}>;

export const PageLayout: FunctionalComponent<PageLayoutProps> = ({
  design = "light",
  title,
  withCloseButton,
  withTapBar,
  buttons,
  className = "",
  dropStyles,
  children,
  search: Search,
  hideSearchDeps,
  headerStyle,
  gap,
}) => {
  const router = useRouter();
  const [searchSheetOpen, setSearchSheetOpen] = useState(false);
  useEffect(() => setSearchSheetOpen(false), hideSearchDeps);

  return (
    <div className={cn(styles.layoutWrapper, styles[design])}>
      <div
        className={cn(
          styles.layout,
          dropStyles && styles.clear,
          withTapBar && styles.withTapbar,
          className
        )}
        gap={gap}
      >
        {(title || withCloseButton || !!Search) && (
          <div flex column gap={6} style={{ marginBottom: 16 }}>
            {(title || withCloseButton || !!Search) && (
              <div className={headerStyle ?? styles.header}>
                {title && <h1>{title}</h1>}
                {withCloseButton && <CloseButton position="static" />}
              </div>
            )}
            {Boolean(Search) && (
              <SearchButton onClick={() => router.goTo([router.route[0], "search"])} />
            )}
          </div>
        )}
        {children}
        {Boolean(buttons) && (
          <ButtonsBar at="bottomWithTapbar">{buttons}</ButtonsBar>
        )}
        {withTapBar && <TapBar />}
        {searchSheetOpen && Search && (
          <Sheet
            children={<Search />}
            noShadow={true}
            height="100%"
            onClose={() => router.goTo([router.route[0]])}
          />
        )}
      </div>
    </div>
  );
};
