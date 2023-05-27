import { useCell } from "@helpers/cell-state";
import { bookmarksStore } from "@stores/bookmarks.store";
import styles from "./snackbar.module.css";
import { FunctionalComponent } from "preact";
import { SvgIcon } from "@icons";
import { useRouter } from "../../routing";

export type SnackbarProps = {};
export const Snackbar: FunctionalComponent<SnackbarProps> = () => {
  const router = useRouter();
  const cancelable = router.route[0] == "bookmarks";
  const lastHistory = useCell(bookmarksStore.lastHistory);
  // lastHistory.push({
  //   action: "add",
  //   type: "movie",
  //   id: "asdasd",
  //   time: new Date(),
  // });
  if (lastHistory.length == 0) return <div class={styles.snackbarHidden} />;
  const last = lastHistory[lastHistory.length - 1];
  return (
    <div class={styles.snackbar} onClick={() => bookmarksStore.history.clear()}>
      {last.action === "add"
        ? "Добавлено в избранное"
        : "Удалено из избранного"}
      {lastHistory.length > 1 && <div>({lastHistory.length})</div>}
      <div flex-grow></div>
      {cancelable ? (
        <div
          class={styles.cancel}
          onClick={async (e) => {
            e.preventDefault();
            for (const x of lastHistory) {
              await bookmarksStore.switchBookmark(x.type, x.id, true);
            }
            bookmarksStore.history.clear();
          }}
        >
          Отмена
        </div>
      ) : (
        <SvgIcon id="#ok-circle" size="20" class="colorElBlue" />
      )}
    </div>
  );
};
