import React, { FC } from "preact/compat";
import { useCellState } from "@helpers/cell-state";
import { categoriesStore } from "@stores";

export type NoteFormProps = {
  onSubmit?: (note: Omit<INote, "createdDate" | "createdBy">) => void;
  onCancel?: () => void;
} & { note?: Omit<INote, "createdDate" | "createdBy"> };

export const NoteForm: FC<NoteFormProps> = ({ note, onSubmit }) => {
  const [categories] = useCellState(categoriesStore);

  const setValue = (value: string, key: keyof INote, event: any) => {
    note[key] = value;
  };

  return (
    <form onSubmit={ (event) => onSubmit(note) }>
      <label htmlFor="name">Наименование</label>
      <input id="name" value={note.title} onChange={e => setValue('Test', 'title', e.target)} />

      <section className="form-body">
        <label htmlFor="text">Содержимое</label>
        <textarea id="text" value={note.text} onChange={e => setValue('Test', 'text', e)}/>

        <button type="submit">
          Сохранить
        </button>
      </section>
    </form>
  );
};
