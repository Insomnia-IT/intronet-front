import {FunctionalComponent} from "preact";
import {CardInfo} from "../card-list";
import {RoutePath, RoutePathString, useRouter} from "../../routing";
import styles from "../main-page.module.css";
import {Button, ButtonsBar, CloseButton} from "@components";
import {Cell} from "@cmmn/cell/lib";
import {useCell} from "@helpers/cell-state";

export const IsMenuOpen = new Cell(false);
const switchOpen = () => IsMenuOpen.set(!IsMenuOpen.get());

export type MainCard = {
  info: CardInfo;
}
export const Menu: FunctionalComponent = () => {
  const router = useRouter();
  const isOpen = useCell(IsMenuOpen);
  return <>
    <ButtonsBar at="bottom" onClick={switchOpen}>
      <Button class={styles.menuBtn}>МЕНЮ</Button>
    </ButtonsBar>
    <div class={isOpen ? styles.menuOpen: styles.menu}>
      {items.map(x => <div key={x.href} onClick={() => {
        router.goTo([x.href]);
        switchOpen();
      }} class={x.href === router.route[0] ? 'colorPink': ''}>
        <h2>{x.title}</h2>
        {x.descr && <div class="text-small">{x.descr}</div>}
      </div>)}
      <CloseButton onClick={switchOpen} white/>
    </div>
  </>;
}

const items: Array<{
  title: string;
  href: RoutePath[0];
  descr?: string;
}> = [
  {title: 'Главная', href: 'main'},
  {title: 'Карта', href: 'map'},
  {title: 'Анимация', href: 'timetable', descr: 'Расписание мультфильмов'},
  {title: 'неАнимация', href: 'activities', descr: 'Дневные активности'},
  {title: 'Объявления', href: 'board'},
  {title: 'Избранное', href: 'bookmarks', descr: 'Сохранённые мультфильмы, мероприятия и объявления'},
]
