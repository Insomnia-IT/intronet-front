import {Cell} from "@cmmn/cell/lib";
import {Button} from "@components";
import {Label} from "@components/label/label";
import {Tag, Tags} from "@components/tag";
import {useCell} from "@helpers/cell-state";
import {useForm} from "@helpers/useForm";
import {Directions, locationsStore} from "@stores";
import {useMemo} from "preact/hooks";
import {useRouter} from "../../routing";

export const LocationEdit = () => {
  const router = useRouter();
  const cell = useMemo(() => new Cell(() => locationsStore.Locations.find(x => x._id === router.route[2])), [router.route[2]]);
  const ref = useForm(cell);
  const location = useCell(cell);
  const isNew = useCell(() => !!locationsStore.newLocation);
  return <div flex column gap={4}>
    {!isNew && <Button type="textSimple" class="colorOrange" onClick={() => {
      locationsStore.deleteLocation(cell.get());
      router.goTo("/map")
    }} style={{
      alignSelf: "flex-start",
      padding: '24px 0',
    }}>Удалить точку с карты</Button>}
    <form ref={ref} flex column gap={2}>
      <Label title="Название точки" name="name"/>
      {!isNew && <>
        <Tags tagsList={[
          Directions.wc,
          Directions.branches,
          Directions.lectures
        ]}>
          {(direction) => <Tag selected={location?.directionId === direction}
            onClick={() => cell.set({...location, directionId: direction})}>{direction}</Tag>}
        </Tags>
        <Tags tagsList={[
          Directions.shop,
          Directions.art,
          Directions.shower
        ]}>
          {(direction) => <Tag selected={location?.directionId === direction}
                               onClick={() => cell.set({...location, directionId: direction})}>{direction}</Tag>}
        </Tags>
      </>}
      <Label title="Описание" inputType="textarea" name="description" rows={5}/>
    </form>
    <Button type="vivid" onClick={async () => {
      await locationsStore.updateLocation(cell.get());
      router.goTo("/map")
    }}>готово</Button>
  </div>
}
