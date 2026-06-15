import { useNotesRouter } from "./hooks/useNotesRouter";
import { MyPage } from "./my/my-page";
import { NewNotePage } from "./new/new-note-page";
import { ModerationPage } from "./moderator/moderation-page/moderation-page";
import { NotesSearch } from './search/notes-search'
import { NotesAll } from './notes/notes-all'

export function NotesPage() {
  const { section } = useNotesRouter();

  switch (section) {
    case "search":
      return <NotesSearch />;

    case "new":
      return <NewNotePage />;

    case "my":
      return <MyPage />;

    case "moderation":
      return <ModerationPage />;

    case undefined:
      return <NotesAll/>;

    default:
      return null;
  }
};
