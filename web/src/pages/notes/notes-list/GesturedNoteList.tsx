import { FunctionalComponent } from "preact";
import { useGestureCell } from "../../../helpers/Gestures";
import { INotesListProps, NotesList } from "./NotesList";

export type IGesturedNotesListProps = Omit<INotesListProps, "withGesture" | "gesture" | "setRef">

export const GesturedNotesList: FunctionalComponent<IGesturedNotesListProps> = (props) => {
  const { setRef, gesture } = useGestureCell();

  return <NotesList setRef={setRef} withGesture gesture={gesture} {...props} />
}
