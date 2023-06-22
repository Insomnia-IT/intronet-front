import { FunctionalComponent } from "preact";
import { useMemo } from "preact/hooks";
import { useCell } from "@helpers/cell-state";
import {locationsStore, LocationStore} from "@stores";
import { bookmarksStore } from "@stores/bookmarks.store";
import { Button, ButtonsBar } from "@components";
import { Link } from "@components/link/link";
import { SvgIcon } from "@icons";
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
  const store = useMemo(() => new LocationStore(id), [ id ]);
  const {location, hasBookmark} = useCell(store.state);
  const isEdit = useCell(() => locationsStore.isEdit);
  const isMoving = useCell(() => locationsStore.isMoving);
  if (!location) return <></>;
  if (isMoving) return <div flex column gap="2">
    <div className={ [ "sh1", Styles.locationHeader ].join(" ") }>
      { location.name }
    </div>
    <Button type="vivid" class="w-full"
            onClick={() => locationsStore.applyChanges()}>
      <SvgIcon id="#movePoint"/> Разместить тут
    </Button>
  </div>
  return (
    <div className={ Styles.container }>
      <div className={ [ "sh1", Styles.locationHeader ].join(" ") }>
        { location.name }
      </div>

      <div className={ Styles.locationContent }>
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
  const detailGroup = directionsToDetailsGroup.get(location.directionId);

  switch (detailGroup) {
    case "cafe":
      return (
        <>
          <div className="text colorMediumBlue"> { location.description }</div>

          <Link goTo={ [ "map", ] }>Посмотреть меню</Link>
        </>
      );
    case "shop":
      return (
        <>
          <div className="text colorMediumBlue"> { location.description }</div>

          <Link goTo={ [ "map", ] }>Перейти к списку палаток</Link>
        </>
      );
    case "screen":
      return (
        <>
          <div className="text colorMediumBlue"> { location.description }</div>

          <Link goTo={ [ "timetable", ] }>К расписанию</Link>
        </>
      );
    case "music":
    case "activity":
      return (
        <>
          <div className="text colorMediumBlue"> { location.description }</div>

          <Link goTo={ [ "activities", ] }>К расписанию</Link>
        </>
      );
    case "tent":
      return (
        <>
          <div className="text colorMediumBlue"> { location.description }</div>

          <Link goTo={ [ "map", ] }>Правила кемпинга</Link>

          <Link goTo={ [ "map", ] }>Про экологию и мусор</Link>
        </>
      );
    case "info":
      return (
        <>
          <div className="text colorMediumBlue"> { location.description }</div>

          <Link goTo={ [ "main", ] }>К разделам</Link>
        </>
      );
    case "point":
      return (
        <>
          <div className="text colorMediumBlue"> { location.description }</div>

          <Link goTo={ [ "map", ] }>Я потерял ребёнка</Link>
          <Link goTo={ [ "map", ] }>Я потерял взрослого</Link>
          <Link goTo={ [ "map", ] }>Я потерял животное</Link>
          <Link goTo={ [ "map", ] }>я потерял вещь</Link>
        </>
      );
    case "med":
      return (
        <>
          <div className="text colorMediumBlue"> { location.description }</div>

          <Link goTo={ [ "map", ] }>Я поранился</Link>
          <Link goTo={ [ "map", ] }>Как помочь раненому</Link>
          <Link goTo={ [ "map", ] }>Про клещей</Link>
        </>
      );
    case "wc":
    case "art":
    case "other":
    default:
      return (
        <div className="text colorMediumBlue"> { location.description }</div>
      );
  }
}
