import { SearchInput } from "@components/input/search-input";
import { ChangeEvent } from "preact/compat";
import styles from "./search.module.css";

interface SearchProps {
  onInput: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const Search = ({ onInput }: SearchProps) => (
  <div class={styles.search}>
    <SearchInput autofocus tabIndex={0} onInput={onInput}/>
  </div>
)
