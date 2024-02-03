import { FunctionalComponent } from "preact";
import { useCallback } from "preact/hooks";
import cn from 'classnames';
import { useRouter } from "../../pages/routing";
import { SvgIcon } from "../../icons";
import { TapBarItems } from "./dict";
import type { TapBarItem } from "./types";
import styles from './TapBar.module.css';

export type TapBarItemProps = TapBarItem & {
  isActive: boolean;
  onClick: (id: TapBarItem['id']) => void;
}

export const Item: FunctionalComponent<TapBarItemProps> = ({
  id,
  iconId,
  name,
  isActive,
  onClick
}) => {
  const handleClick = () => onClick(id);

  return (
    <div
      className={cn(styles.item, isActive && styles.active)}
      onClick={handleClick}
    >
      <SvgIcon id={iconId} size={28} />
      <span>{name}</span>
    </div>
  )
}

export const TapBar: FunctionalComponent<unknown> = () => {
  const router = useRouter();

  const onClick = useCallback((id: TapBarItem['id']) => {
    router.goTo([id]);
  }, [router])

  return (
    <div className={styles.layout}>
      {TapBarItems.map(item => (
        <Item
          key={item.id}
          isActive={item.id === router.route[0]}
          {...item}
          onClick={onClick}
        />
      ))}
    </div>
  )
}
