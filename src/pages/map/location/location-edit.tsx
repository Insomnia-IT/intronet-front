import {Cell} from "@cmmn/cell/lib";
import {Button} from "@components";
import {Label} from "@components/label/label";
import {useForm} from "@helpers/useForm";
import {locationsStore} from "@stores";
import {useMemo} from "preact/hooks";
import {useRouter} from "../../routing";

export const LocationEdit = () => {
  const router = useRouter();
  const cell = useMemo(() => new Cell(() => locationsStore.Locations.find(x => x._id === router.route[2])), [router.route[2]]);
  const ref = useForm(cell);
  return <div flex column gap={4}>
    <Button type="textSimple" class="colorOrange" style={{
      alignSelf: "flex-start",
      padding: '24px 0',

    }}>Удалить точку с карты</Button>
    <form ref={ref} flex column gap={2}>
      <Label title="Название точки" name="name"/>
      <Label title="Описание" inputType="textarea" name="description" rows={5}/>
    </form>
    <Button type="vivid" onClick={() => locationsStore.updateLocation(cell.get())}>готово</Button>
  </div>
}
