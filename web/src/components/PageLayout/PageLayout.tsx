import { FunctionalComponent } from "preact";
import { CSSProperties, PropsWithChildren, ReactNode } from "preact/compat";
import cn from "classnames";
import { TapBar } from "@components/TapBar";
import styles from "./PageLayout.module.css";
import { ButtonsBar, CloseButton, Sheet } from "@components";
import { SvgIcon } from "@icons";
import {
  goTo,
  RoutePath,
  RoutePathString,
  useRouter,
} from "../../pages/routing";
import { useEffect, useState } from "preact/hooks";
import { SearchInput } from "@components/input/search-input";

export type PageLayoutProps = PropsWithChildren<{
  design?: "light" | "dark" | "full";
  title?: ReactNode;
  /* При наличии добавит к заколовку переход в Избранное */
  favoritesRoute?: RoutePath | RoutePathString;
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
  favoritesRoute,
  withCloseButton,
  withTapBar,
  buttons,
  className = "",
  dropStyles,
  children,
  search: Search,
  searchStyle,
  hideSearchDeps,
  searchLabel,
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
        <div flex column gap={5}>
          {(title || withCloseButton || !!Search || favoritesRoute) && (
            <div className={headerStyle ?? styles.header}>
              {title && <h1>{title}</h1>}
              {Boolean(favoritesRoute) && (
                <SvgIcon
                  id="#bookmark"
                  style={{
                    color: design == "dark" ? "var(--white)" : "var(--vivid)",
                  }}
                  size={32}
                  onClick={() => goTo(favoritesRoute)}
                />
              )}
              {withCloseButton && <CloseButton position="static" />}
            </div>
          )}
          {Boolean(Search) && (
            <SearchInput
              placeholder={searchLabel}
              style={searchStyle}
              onFocus={() => router.goTo([router.route[0], "search"])}
            />
          )}
        </div>
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
