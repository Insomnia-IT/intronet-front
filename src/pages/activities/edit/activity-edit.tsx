import {Button, ButtonsBar} from "@components";
import {Input} from "@components/input";
import {Tag, Tags} from "@components/tag";
import {useCell} from "@helpers/cell-state";
import {getDayText} from "@helpers/getDayText";
import {ActivityStore} from "@stores/activities/activities.store";
import {changesStore} from "@stores/changes.store";
import {useMemo} from "preact/hooks";
import {useRouter} from "../../routing";

export const ActivityEdit = () => {
  const router = useRouter();
  const id = router.route[2] as string;
  const activityStore = useMemo(() => new ActivityStore(id), [id]);
  const state = useCell(activityStore.state);
  if (!state.activity)
    return <>Not found</>;
  return <div class="page" flex column gap="2">
    <div class="sh1">{state.activity.title}</div>
    <div className="sh3">День</div>
    <Tags value={state.activity.day} tagsList={[0, 1, 2, 3, 4]}>
      {(d) => (
        <Tag selected={d == state.activity.day} key={d} onClick={() =>
          changesStore.addChange({
            _id: id,
            day: d
          })}>
          {getDayText(d, "short").toUpperCase()}
        </Tag>
      )}
    </Tags>
    <div className="sh3">Время</div>
    <div flex gap={4}>
      <Input type="time" value={state.activity.start} onChange={e => {
        changesStore.addChange({
          _id: id,
          start: e.currentTarget.value
        })
      }}/>
      <Input type="time"  value={state.activity.end} onChange={e => {
        changesStore.addChange({
          _id: id,
          end: e.currentTarget.value
        })
      }}/>
    </div>
    <Button type="text" class="colorOrange" onClick={() => {
      changesStore.addChange({
        _id: id,
        isCanceled: !state.activity.isCanceled
      });
    }}>отменить {state.activity.isCanceled ? 'отмену мероприятия' : 'мероприятие'}</Button>
    <ButtonsBar at="bottom">
      <Button type="blue" onClick={async () => {
        await changesStore.applyChanges()
        router.goTo(["activities"]);
      }}>
        опубликовать изменения
      </Button>
    </ButtonsBar>
  </div>;
}
