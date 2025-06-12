import { Input } from "@components/input";
import { useCell } from "@helpers/cell-state";
import { SearchPlug } from "@components/plugs/search/SearchPlug";
import { searchStore } from "@stores/search.store";
import { useEffect } from "preact/hooks";
import { PageHeader } from "@components/PageHeader/PageHeader";
import { NotesList } from '../NotesList/NotesList'
import { Sheet } from '@components'

export const NotesSearch = () => {
  const query = useCell(searchStore.query);
  const notes = useCell(searchStore.filteredNotes);
  useEffect(() => () => searchStore.query.set(''), []);
  return (
    <Sheet
      height="100%"
    >
      <div flex column gap={5} class="h-full">
      <PageHeader titleH1={'поиск'} withCloseButton/>

      <Input
        placeholder="Описание объявления"
        autofocus
        value={query}
        onInput={searchStore.onInput}
      />
      {notes.length > 0 ? (
        <NotesList notes={notes} />
      ) : (
        <SearchPlug
          title={"Ничего не найдено"}
          text={""}
        ></SearchPlug>
      )}
    </div>
    </Sheet>
  );
};
