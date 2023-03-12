import * as React from "preact/compat";
import { RequireAuth } from "@components/RequireAuth";
import { useAppContext } from "@helpers/AppProvider";
import { CreatedDate } from "./createdDate/createdDate";
import { NoteText } from "./noteText/noteText";
import styles from "./boardCard.module.css";

export interface IBoardCard {
  noteInfoObj: INote;
  activeColor: string;
  categoryName?: ICategory["name"];
  onEditIconButtonClick?: (note: INote) => void;
  onDeleteIconButtonClick?: (note: INote) => void;
}

export const BoardCard = ({
                            noteInfoObj,
                            activeColor,
                            onEditIconButtonClick,
                            onDeleteIconButtonClick,
                            categoryName,
                          }: IBoardCard) => {
  const {title, text} = noteInfoObj;

  const app = useAppContext();

  // Если у объявления нет никакого контента, и пользователь не обладает редакторскими павами, объявление не отображается.
  if (!title && !text && !app.auth.token) return <></>;

  return (
    <div className={ styles.container }>
      <span className={ styles.textBody }>
        <span className={ styles.header }>
          <h3>{ title }</h3>
        </span>
        <NoteText text={ text }/>
      </span>

      <div className={ styles.footer }>
        <CreatedDate date={ noteInfoObj.createdDate }/>
      </div>
    </div>
  );
};
