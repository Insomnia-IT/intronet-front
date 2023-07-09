import {Cell} from "@cmmn/cell/lib";
import {Button} from "@components";
import {Input} from "@components/input";
import {Label} from "@components/label/label";
import {Tag, Tags} from "@components/tag";
import {useCell} from "@helpers/cell-state";
import {useForm} from "@helpers/useForm";
import {SvgIcon} from "@icons";
import {Directions, locationsStore} from "@stores";
import {FunctionalComponent} from "preact";
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
      <Label title="Описание" inputType="textarea" name="description" rows={5}/>
      {location?.contentBlocks.map((c,i) => <ContentBlockEdit locationCell={cell} index={i} key={i}/>)}
      <Button style={{padding: 0}} type="text" onClick={() => cell.set({
        ...location,
        contentBlocks: [...location.contentBlocks, {blockType: "text", content: ""}]
      })}><SvgIcon id="#plus"></SvgIcon>добавить выше</Button>
    </form>
    <Button type="vivid" onClick={async () => {
      await locationsStore.updateLocation(cell.get());
      router.goTo("/map")
    }}>готово</Button>
  </div>
}

const ContentBlockEdit: FunctionalComponent<{
  locationCell: Cell<InsomniaLocation>;
  index: number;
}> = (props) => {
  const location = useCell(props.locationCell);
  const block = location.contentBlocks[props.index];
  const remove = () => props.locationCell.set({
    ...location,
    contentBlocks: [
      ...location.contentBlocks.slice(0, props.index),
      ...location.contentBlocks.slice(props.index + 1),
    ]
  })
  const add = () => props.locationCell.set({
    ...location,
    contentBlocks: [
      ...location.contentBlocks.slice(0, props.index),
      {
        blockType: "text",
        content: ""
      },
      ...location.contentBlocks.slice(props.index),
    ]
  })
  const patch = (patch: Partial<ContentBlock>) => props.locationCell.set({
    ...location,
    contentBlocks: [
      ...location.contentBlocks.slice(0, props.index),
      {
        ...block,
        ...patch,
      } as ContentBlock,
      ...location.contentBlocks.slice(props.index + 1),
    ]
  })
  return <>
    <div flex gap="2" center style={{marginTop: 16}} class="textSmall colorMediumBlue">
      <span onClick={() => patch({blockType: block.blockType === "text" ? "link" : "text"})}>
        {block.blockType === "text" ? 'Текст' : 'Ссылка'}
      </span>
      <span>{props.index}</span>
      <SvgIcon id="#trash" onClick={remove}></SvgIcon>
      <Button style={{padding: 0}} type="text" onClick={add}><SvgIcon id="#plus"></SvgIcon>добавить выше</Button>
    </div>
    {block.blockType === "text" && <Input value={block.content} onChange={e => patch({content: e.currentTarget.value})}/>}
    {block.blockType === "link" && <>
      <Input value={block.link} onChange={e => patch({link: e.currentTarget.value})}/>
      <Input value={block.title} onChange={e => patch({title: e.currentTarget.value})}/>
    </>}
  </>
}
