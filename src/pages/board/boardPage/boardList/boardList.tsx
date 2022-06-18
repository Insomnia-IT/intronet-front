import * as React from "react";
import { BoardCard } from "./boardCard/boardCard";
import { Observer } from "cellx-react";
import { notesStore, pagesStore, categoriesStore } from "src/stores";
import { VStack } from "@chakra-ui/react";
import { Box } from "@chakra-ui/react";
import { Intersection } from "../../../../components/intersection";
import { scrollToRef } from '../../../../helpers/scrollToRef';

@Observer
export default class BoardList extends React.Component<{}, {}> {
  private searchParams: URLSearchParams;
  private activeNote: React.RefObject<HTMLLIElement>;

  constructor(props) {
    super(props);
    this.searchParams = new URLSearchParams(window.location.search);
    this.activeNote = React.createRef();
  }

  componentDidMount() {
    notesStore.load();
    if (this.activeNote.current) scrollToRef(this.activeNote, true)
  }

  componentDidUpdate(): void {
    if (this.activeNote.current) scrollToRef(this.activeNote, true)
  }

  render() {
    return (
      <Box w={"100%"}>
        {pagesStore.notes.length === 0 && (
          <h2 style={{ textAlign: "center" }}>Объявлений пока нет!</h2>
        )}
        <VStack
          as={"ul"}
          align={"streach"}
          spacing={4}
        >
          {pagesStore.notes.map((note) => {
            const activeNote = parseInt(this.searchParams.get("id"));
            const ref = note.id === activeNote ? this.activeNote : null;

            return (
              <li key={note.id} ref={ref}>
                <Intersection width="100%" height="200px">
                  <BoardCard
                    noteInfoObj={note}
                    activeColor={categoriesStore.getCategoryColor(
                      note.categoryId
                    )}
                  />
                </Intersection>
              </li>
            );
          })}
        </VStack>
      </Box>
    );
  }
}
