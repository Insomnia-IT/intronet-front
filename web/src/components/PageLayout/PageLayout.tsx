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
import { ActivitySearch } from "../../pages/activities/search/activity-search";
import { SearchInput } from "@components/input/search-input";

export type PageLayoutProps = PropsWithChildren<{
  design?: "light" | "dark";
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
  search?: FunctionalComponent;
  searchStyle?: CSSProperties;
  hideSearchDeps?: any[];
  searchLabel?: string;
  headerStyle?: string;
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
}) => {
  const router = useRouter();
  const [searchSheetOpen, setSearchSheetOpen] = useState(false);
  useEffect(() => setSearchSheetOpen(false), hideSearchDeps);
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
      <div className={headerStyle ?? styles.header}>
        <h1>{title}</h1>
        {Boolean(favoritesRoute) && (
          <SvgIcon
            id="#bookmark"
            style={{ color: "var(--medium-blue)" }}
            size={32}
            onClick={() => goTo(favoritesRoute)}
          />
        )}
        {withCloseButton && <CloseButton position="static" />}
        {Boolean(Search) && (
          <SearchInput
            placeholder={searchLabel}
            style={searchStyle}
            onFocus={() => setSearchSheetOpen(true)}
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
          children={
            <>
              <Search />
              <CloseButton onClick={() => setSearchSheetOpen(false)} />
            </>
          }
          noShadow={true}
          height="100%"
          onClose={() => router.goTo([router.route[0]])}
        />
      )}
    </div>
  );
};
