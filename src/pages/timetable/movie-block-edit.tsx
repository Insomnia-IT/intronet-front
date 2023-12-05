import {Button, ButtonsBar, CloseButton} from "@components";
import {Field} from "@components/forms";
import {Input} from "@components/input";
import {Label} from "@components/label/label";
import {Tag, Tags} from "@components/tag";
import {useCell} from "@helpers/cell-state";
import {getDayText} from "@helpers/getDayText";
import {moviesStore} from "@stores";
import {changesStore} from "@stores/changes.store";
import {useRouter} from "../routing";
import { orderBy } from "@cmmn/core";

export const MovieBlockEdit = () => {
  const router = useRouter();
  const id = router.route[2];
  const block = useCell(() => moviesStore.MovieBlocks.find(x => x._id === id));
  if (!block) return <></>;
  const views = orderBy(block.views,x => x.day);
  return <div flex column gap={4} style={{marginTop: 50}}>
    <div class="sh1">{block.info.Title} {block.info.SubTitle ?? ''}</div>
    {views.map((x, i) => <EditMovieBlockView index={i} block={block}/>)}
    {["Title", "SubTitle", "TitleEn", "SubTitleEn"].map(key => (
      <Label key={key} inputType="textarea" rows={3} value={block.info[key]}
             title={key} onChange={e => moviesStore.patchBlockInfo(block._id, {
        [key]: e.currentTarget.value
      })}/>))}
    <div flex gap="2">
    <Label value={block.info.Part} type="number"
           title="Part" onChange={e => moviesStore.patchBlockInfo(block._id, {
            Part: +e.currentTarget.value
          })}/>
      <Label value={block.info.MinAge} type="number"
             title="MinAge" onChange={e => moviesStore.patchBlockInfo(block._id, {
        MinAge: +e.currentTarget.value
      })}/>
    </div>
    <ButtonsBar at="bottom">
      <Button type="blue" onClick={async () => {
        await moviesStore.applyChanges();
        await changesStore.applyChanges();
        router.goTo(["timetable"]);
      }}>
        опубликовать изменения
      </Button>
    </ButtonsBar>
    <CloseButton onClick={() => {
      moviesStore.discardChanges();
      changesStore.clearChanges();
      router.goTo("/timetable");
    }}/>
  </div>;
}

const EditMovieBlockView = (props: {
  index: number; block: MovieBlock;
}) => {
  const router = useRouter();
  const view = props.block.views[props.index];
  if (!view) return <></>
  return <>
    <div className="sh3">День {props.index == 0 ? 'первого' : 'второго'} показа</div>
    <Tags value={view.day} tagsList={[0, 1, 2, 3, 4]}>
      {(d) => (<Tag selected={d == view.day} key={d} onClick={() => changesStore.addChange({
          _id: `${props.block._id}.${props.index}`, day: d
        })}>
          {getDayText(d, "short").toUpperCase()}
        </Tag>)}
    </Tags>
    <div class="sh3">Время {props.index == 0 ? 'первого' : 'второго'} показа</div>
    <div flex gap={4}>
      <Input type="time" value={view.start} onChange={e => {
        changesStore.addChange({
          _id: `${props.block._id}.${props.index}`, start: e.currentTarget.value
        })
      }}/>
      <Input type="time" value={view.end} onChange={e => {
        changesStore.addChange({
          _id: `${props.block._id}.${props.index}`, end: e.currentTarget.value
        })
      }}/>
    </div>
  </>
}
