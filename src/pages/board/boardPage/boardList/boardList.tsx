import React, { FC, useEffect, useRef } from "preact/compat";

import { categoriesStore, notesStore, pagesStore } from "@stores";
import { Button, toast } from "@components";
import { NoteModal } from "@components/modals";
import { Intersection } from "@components/intersection";
import { Modal } from "@components/modal";
import { useAppContext } from "@helpers/AppProvider";
import { scrollToRef } from "@helpers/scrollToRef";
import { useCellState } from "@helpers/cell-state";
import { BoardCard } from "./boardCard/boardCard";
import { useRouter } from "../../../routing";
import styles from "./boardList.module.css";
import btnStyle from "../../../../components/button/button.module.css";

export const BoardList: FC = () => {
  const {route} = useRouter();
  const id = route[1];
  const activeNote = useRef<HTMLLIElement>(null);

  const app = useAppContext();

  const handleAdd = async () => {
    try {
      const newNote = await Modal.show<INote>((props) => (
        <NoteModal { ...props } />
      ));

      await notesStore.addNote({
        body: newNote,
      });
      toast({
        title: "Объявление успешно добавлено!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "Ошибка добавления объявления.",
          description: error.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  const handleEdit = async (note: INote) => {
    try {
      const editedNote = await Modal.show<INote>((props) => (
        <NoteModal { ...props } { ...note } />
      ));
      await notesStore.editNote({
        body: {_id: id, categoryId: note.categoryId, ...editedNote},
      });
      toast({
        title: "Объявление успешно изменено!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "Ошибка изменения объявления.",
          description: error.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  const handleDelete = async (note: INote) => {
    try {
      await notesStore.removeNote({path: {id: note._id}});
      toast({
        title: "Объявление успешно удалено!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      if (error instanceof Error) {
        toast({
          title: "Ошибка удаления объявления.",
          description: error.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  useEffect(() => {
    if (activeNote.current) scrollToRef(activeNote, true);
  }, []);

  const [ notes ] = useCellState(() => pagesStore.notes);

  return (
    <div width="100%">
      { notes.length === 0 && (
        <h2 style={ {textAlign: "center"} }>Объявлений пока нет!</h2>
      ) }
      <ul className={ styles.list }>
        { notes.map((note) => (
          <li key={ note._id } ref={ id === note._id ? activeNote : null }>
            <Intersection width="100%" height={ getBoardCardHeight(note) + "px" }>
              <BoardCard
                noteInfoObj={ note }
                activeColor={ categoriesStore.getCategoryColor(note.categoryId) }
                onEditIconButtonClick={ handleEdit }
                onDeleteIconButtonClick={ handleDelete }
              />
            </Intersection>
          </li>
        )) }
      </ul>

      <section className={ styles.actions }>
        <Button
          className={ btnStyle.button_blue }
          onClick={ handleAdd }
          aria-label="Add note"
        >{ 'Добавить' }</Button>

        <Button
          className={ btnStyle.button_blue }
          onClick={ () => console.log('Route to add new one')}
        >{ 'Мои объявления' }</Button>
      </section>
    </div>
  );
};

function getBoardCardHeight(note: INote) {
  return 100;
}
