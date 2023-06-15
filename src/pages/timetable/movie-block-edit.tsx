import { Fn } from "@cmmn/cell/lib";
import {Button, ButtonsBar, CloseButton} from "@components";
import {Input} from "@components/input";
import {Tag, Tags} from "@components/tag";
import {useCell} from "@helpers/cell-state";
import {getDayText} from "@helpers/getDayText";
import {moviesStore} from "@stores";
import {changesStore} from "@stores/changes.store";
import {routes, useRouter} from "../routing";

export const MovieBlockEdit = () => {
  const router = useRouter();
  const id = router.route[2];
  const movieBlock = useCell(() => moviesStore.MovieBlocks.find(x => x._id === id));
  if (!movieBlock)
    return <></>;
  const views = movieBlock.views.orderBy(x => x.day);
  return <div flex column gap={4} style={{marginTop: 50}}>
    <div class="sh1">{movieBlock.info.Title} {movieBlock.info.SubTitle}</div>
    {views.map((x, i) => <EditMovieBlockView index={i} block={movieBlock}/>)}
    <CloseButton onClick={() => changesStore.clearChanges()}/>
  </div>;
}

const EditMovieBlockView = (props: {
  index: number;
  block: MovieBlock;
}) => {
  const router = useRouter();
  const view = props.block.views[props.index];
  console.log(view)
  if (!view) return <></>
  return <>
    <div className="sh3">День {props.index == 0 ? 'первого' : 'второго'} показа</div>
    <Tags value={view.day} tagsList={[0, 1, 2, 3, 4]}>
      {(d) => (
        <Tag selected={d == view.day} key={d} onClick={() =>
          changesStore.addChange({
            _id: `${props.block._id}.${props.index}`,
            day: d
          })}>
          {getDayText(d, "short").toUpperCase()}
        </Tag>
      )}
    </Tags>
    <div class="sh3">Время {props.index == 0 ? 'первого' : 'второго'} показа</div>
    <div flex gap={4}>
      <Input type="time" value={view.start} onChange={e => {
        changesStore.addChange({
          _id: `${props.block._id}.${props.index}`,
          start: e.currentTarget.value
        })
      }}/>
      <Input type="time" value={view.end} onChange={e => {
        changesStore.addChange({
          _id: `${props.block._id}.${props.index}`,
          end: e.currentTarget.value
        })
      }}/>
    </div>
    <ButtonsBar at="bottom">
      <Button type="blue" onClick={async () => {
        await changesStore.applyChanges()
        router.goTo(["timetable"]);
      }}>
        опубликовать изменения
      </Button>
    </ButtonsBar>
  </>
}
