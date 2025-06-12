import {Button, ButtonsBar} from "../../../components";
import {Input} from "../../../components/input";
import {Tag, Tags} from "../../../components/tag";
import {useCell} from "../../../helpers/cell-state";
import {getDayText} from "../../../helpers/getDayText";
import {activitiesStore, ActivityStore} from "../../../stores/activities/activities.store";
import {changesStore} from "../../../stores/changes.store";
import {useEffect, useMemo} from "preact/hooks";
import {useRouter} from "../../routing";
import {PageHeader} from "@components/PageHeader/PageHeader";
import {Label} from "@components/label/label";
import {useForm} from "@helpers/useForm";
import {Cell} from "@cmmn/cell";
import {locationsStore} from "@stores";
import {Fn} from "@cmmn/core";
import { OnlineButton } from '@components/buttons/online-button'

type ActivityEditProp = {
  mode: 'create' | 'full' | 'time';
}

export const ActivityEdit = ({mode}: ActivityEditProp) => {
  const router = useRouter();
  const id = router.route[2] as string;
  const locations = useCell(() => locationsStore.LocationsForActivity);
  const cell = useMemo(
    () =>
      new Cell(() => {
        const activity: Activity = activitiesStore.Activities.find((x) => x._id === router.route[2]);
          return activity ?? {
            _id: Fn.ulid(),
            day: 1,
            title: '',
            description: '',
            authors: [],
            locationId: '',
            start: '',
            end: '',
            isCanceled: false
          }
        }
      ),
    [router.route[2]]
  );

  const isValid = useCell(() => cell.get().title && cell.get().description && cell.get().start && cell.get().end);

  const activity = useCell(cell);
  const ref = useForm(cell);

  if (!activity)
    return <>Not found</>;

  return (
    <div flex column gap={4}>
      <PageHeader titleH2={ mode === 'create' ? 'Создание' :'Редактирование'} align={'top'} withCloseButton/>

      {mode !== 'time' && (
        <form ref={ref} flex column gap={2}>
          <Label required title="Название мероприятия" inputType="textarea" name="title" rows={3}/>
          <Label required title="Описание мероприятия" inputType="textarea" name="description" rows={5}/>
          <Label title="Автор" name="author"/>
          <Label title="Описание автора" inputType="textarea" name="authorDescription" rows={5}/>

          <Tags style={{flexWrap: 'wrap'}} value={activity.locationId} tagsList={[...locations]}>
            {(d) => (
              <Tag selected={d._id === activity.locationId} key={d} onClick={() =>{
                cell.set({ ...activity, locationId: d._id });
              }}>
                {d.name}
              </Tag>
            )}
          </Tags>
        </form>
      )}

      <div className="sh3">День</div>

      <Tags value={activity.day} tagsList={[0, 1, 2, 3, 4]}>
        {(d) => (
          <Tag selected={d == activity.day} key={d} onClick={() => {
            if (mode === 'time') {
              changesStore.addChange({
                _id: id,
                day: d
              });
            }

            cell.set({ ...activity, day: d });
          }}>
            {getDayText(d, "short").toUpperCase()}
          </Tag>
          )}
        </Tags>

        <div className="sh3">Время</div>
        <div flex gap={4}>
          <Input required type="time" value={activity.start} onChange={e => {
            if (mode === 'time') {
              changesStore.addChange({
                _id: id,
                start: e.currentTarget.value
              });
            }

            cell.set({ ...activity, start: e.currentTarget.value });
          }}/>
          <Input required type="time" value={activity.end} onChange={e => {
            if (mode === 'time') {
              changesStore.addChange({
                _id: id,
                end: e.currentTarget.value
              });
            }

            cell.set({ ...activity, end: e.currentTarget.value });
          }}/>
        </div>

      {
        mode !== 'create' &&
        <Button type="text" class="colorOrange" onClick={() => {
          changesStore.addChange({
            _id: id,
            isCanceled: !activity.isCanceled
          });
        }
        }>отменить {activity.isCanceled ? 'отмену мероприятия' : 'мероприятие'}</Button>
      }

      {
        mode === 'full' &&
        <Button
          type="orange"
          onClick={async () => {
            await activitiesStore.deleteActivity(cell.get());

            router.goTo(["activities"]);
          }}>
          удалить мероприятие
        </Button>
      }

        <ButtonsBar at="bottom">
          <OnlineButton disabled={!isValid} type="blue" onClick={async () => {
            await changesStore.applyChanges();
            await activitiesStore.updateActivity(cell.get());

            router.goTo(["activities"]);
          }}>
            опубликовать изменения
          </OnlineButton>
        </ButtonsBar>
    </div>
);
}
