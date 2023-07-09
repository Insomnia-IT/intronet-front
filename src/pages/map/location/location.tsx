import {getCurrentDay} from "@helpers/getDayText";
import {shopsStore} from "@stores/articles.store";
import { FunctionalComponent } from "preact";
import { useMemo } from "preact/hooks";
import { useCell } from "@helpers/cell-state";
import {locationsStore, LocationStore} from "@stores";
import { bookmarksStore } from "@stores/bookmarks.store";
import { Button, ButtonsBar } from "@components";
import { Link } from "@components/link/link";
import { SvgIcon } from "@icons";
import {useLocationsRouter} from "../hooks/useLocationsRouter";
import Styles from "./location.module.css";
import { directionsToDetailsGroup } from "../mapElement";

export type LocationProps = {
  id: string;
  expanded?: boolean;
};

export const Location: FunctionalComponent<LocationProps> = ({
                                                               id,
                                                               expanded,
                                                             }) => {
  const router = useLocationsRouter();
  const store = useMemo(() => new LocationStore(id), [ id ]);
  const {location, hasBookmark, currentActivity, timetable} = useCell(store.state);
  const isEdit = useCell(() => locationsStore.isEdit);
  const isMoving = useCell(() => locationsStore.isMoving);
  if (!location) return <></>;
  console.log(location?.contentBlocks);
  if (isMoving) return <div flex column gap="2">
    <div className={ [ "sh1", Styles.locationHeader ].join(" ") }>
      { location.name }
    </div>
    <Button type="vivid" class="w-full"
            onClick={async () => {
              if (locationsStore.newLocation) {
                router.goTo(["map", "edit", location._id])
              }else {
                await locationsStore.applyChanges();
              }
            }}>
      <SvgIcon id="#movePoint"/> Разместить тут
    </Button>
  </div>
  return (
    <div className={ Styles.container }>
      <div className={ [ "sh1", Styles.locationHeader ].join(" ") }>
        { location.name }
      </div>

      <div className={ Styles.locationContent }>
        {!!currentActivity && <div>
          <div class="textSmall">Сейчас идёт</div>
          <div class="sh2 ">{currentActivity}</div>
        </div>}
        {timetable == 'activity' && <Link goTo={["activities"]} query={{
          filter: 'place',
          day: getCurrentDay(),
          place: id
        }}>к расписанию</Link>}
        {timetable == 'animation' && <Link goTo={["timetable"]} query={{
          day: getCurrentDay(),
          screen: id
        }}>к расписанию</Link>}
        <div className="text colorMediumBlue"> { location.description }</div>
        <LocationContent location={ {
          ...location,
          description: location.description
            ? location.description
            : 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Animi assumenda consequuntur dolorem dolores facere, maxime non officiis quam quos tempora.'
        } }/>
      </div>
        {isEdit ? <div flex column gap="2" style={{marginTop: 16}}>
            <Button type="frame" class="w-full" goTo={['map', 'edit', id]}>
              <SvgIcon id="#edit" /> Редактировать
            </Button>
            <Button type="frame" class="w-full" onClick={() => locationsStore.isMoving = true}>
              <SvgIcon id="#movePoint"/> переместить точку
            </Button>
            <Button type="frame" class="w-full" onClick={() => locationsStore.deleteLocation(location)}>
              <SvgIcon id="#trash" /> Удалить
            </Button>
          </div> :
          <ButtonsBar at="bottom">
        <Button
          type="vivid"
          onClick={ () =>
            bookmarksStore.switchBookmark("locations", location._id)
          }
          style={ {
            width: "100%",
          } }
        >
          <SvgIcon id="#bookmark" size={ 14 }/>
          { hasBookmark ? "Удалить из избранного" : "сохранить в избранное" }
        </Button>
      </ButtonsBar>
        }
    </div>
  );
};


const LocationContent: FunctionalComponent<{ location: InsomniaLocation }> = ({location}) => {
  const blocks = location.contentBlocks;
  return <>
    {blocks?.map(b => <>
      {b.blockType === "link" && <Link goTo={b.link as any}>{b.title}</Link>}
      {b.blockType === "text" && <div class="text colorMediumBlue">
        {b.content}
      </div>}
    </>)}
  </>;
}
