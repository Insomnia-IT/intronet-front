import { SvgIcon } from "@icons";
import styles from "./button.module.css";
import { Button } from "@components/buttons";

interface SearchButtonProps {
  onClick: () => void
}

export const SearchButton = ({ onClick }: SearchButtonProps) => {
  return (
    <Button className={styles.searchButton} onClick={onClick}>
      <SvgIcon size={16} id="#search" stroke-width={1} className="colorInsNight" />
    </Button>
  );
}
