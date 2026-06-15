import { Cell } from "@cmmn/cell";
import { Button } from "@components";
import { Input } from "@components/input";
import { Label } from "@components/label/label";
import { Tag, Tags } from "@components";
import { useCell } from "@helpers/cell-state";
import { useForm } from "@helpers/useForm";
import { SvgIcon } from "@icons";
import { Directions, locationsStore } from "@stores";
import { authStore } from "@stores/auth.store";
import { FunctionalComponent } from "preact";
import { useEffect, useMemo, useState } from "preact/hooks";
import { useRouter } from "../../routing";
import {
  deleteLocationDescriptionImage,
  locationDescriptionImageUrl,
  syncLocationImageMetadata,
  uploadLocationDescriptionImage,
} from "@api";
import Styles from "./location.module.css";
import ButtonStyles from "@components/buttons/button.module.css";

export const LocationEdit = () => {
  const router = useRouter();
  const cell = useMemo(
    () =>
      new Cell(() =>
        locationsStore.Locations.find((x) => x._id === router.route[2])
      ),
    [router.route[2]]
  );
  const ref = useForm(cell);
  const location = useCell(cell);
  const isNew = useCell(() => !!locationsStore.newLocation);
  const canEdit = useCell(() => locationsStore.canEdit(location), [location]);
  // У пользовательских локаций тип не выбирается — показываем только описание.
  const isUserLocation = !!location?.user;
  // Запрет правки чужой локации при прямом переходе по ссылке.
  useEffect(() => {
    if (location && !isNew && !canEdit) router.goTo("/map");
  }, [location, isNew, canEdit]);
  const canEditDescriptionImage = useCell(() =>
    authStore.hasPermissions(["admin", "superadmin"])
  );
  return (
    <div flex column gap={4}>
      {!isNew && (
        <Button
          type="textSimple"
          class="colorVivid"
          onClick={() => {
            locationsStore.deleteLocation(cell.get());
            router.goTo("/map");
          }}
          style={{
            alignSelf: "flex-start",
            padding: "24px 0",
          }}
        >
          Удалить точку с карты
        </Button>
      )}
      <form ref={ref} flex column gap={2}>
        <Label title="Название точки" name="name" />
        {!isUserLocation && (
          <>
            <Tags
              tagsList={[
                Directions.wc,
                Directions.branches,
                Directions.lectures,
                Directions.master,
              ]}
            >
              {(direction) => (
                <Tag
                  selected={location?.directionId === direction}
                  onClick={() =>
                    cell.set({ ...location, directionId: direction })
                  }
                >
                  {direction}
                </Tag>
              )}
            </Tags>
            <Tags
              tagsList={[
                Directions.shop,
                Directions.cafe,
                Directions.art,
                Directions.freeShower,
              ]}
            >
              {(direction) => (
                <Tag
                  selected={location?.directionId === direction}
                  onClick={() =>
                    cell.set({ ...location, directionId: direction })
                  }
                >
                  {direction}
                </Tag>
              )}
            </Tags>

            <Tags
              tagsList={[
                Directions.paidShower,
                Directions.kpp,
                Directions.music,
                Directions.sign,
              ]}
            >
              {(direction) => (
                <Tag
                  selected={location?.directionId === direction}
                  onClick={() =>
                    cell.set({ ...location, directionId: direction })
                  }
                >
                  {direction}
                </Tag>
              )}
            </Tags>
          </>
        )}
        {canEditDescriptionImage && !isNew && location && (
          <LocationDescriptionImageEditor locationCell={cell} />
        )}
        <Label
          title="Описание"
          inputType="textarea"
          name="description"
          rows={5}
        />
        {location?.contentBlocks?.map((c, i) => (
          <ContentBlockEdit locationCell={cell} index={i} key={i} />
        ))}
        {!isUserLocation && (
          <Button
            style={{ padding: 0 }}
            type="text"
            onClick={() =>
              cell.set({
                ...location,
                contentBlocks: [
                  ...(location.contentBlocks ?? []),
                  { blockType: "text", content: "" },
                ],
              })
            }
          >
            <SvgIcon id="#plus"></SvgIcon>добавить выше
          </Button>
        )}
      </form>
      <Button
        type="vivid"
        onClick={async () => {
          await locationsStore.updateLocation(cell.get());
          router.goTo("/map");
        }}
      >
        готово
      </Button>
    </div>
  );
};

const LocationDescriptionImageEditor: FunctionalComponent<{
  locationCell: Cell<InsomniaLocation>;
}> = ({ locationCell }) => {
  const location = useCell(locationCell);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isBusy, setIsBusy] = useState(false);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  if (!location) return null;

  const fileInputId = `location-desc-image-${location._id}`;

  const onFileChange = async (e: Event) => {
    const input = e.currentTarget as HTMLInputElement;
    const file = input.files?.[0];
    input.value = "";
    if (!file || !file.type.startsWith("image/")) return;

    const localPreview = URL.createObjectURL(file);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(localPreview);
    setIsBusy(true);
    try {
      const { version } = await uploadLocationDescriptionImage(
        location._id,
        file
      );
      await syncLocationImageMetadata(locationCell, {
        hasDescriptionImage: true,
        descriptionImageMime: file.type,
        version,
      });
    } catch (err) {
      console.error(err);
      URL.revokeObjectURL(localPreview);
      setPreviewUrl(null);
    } finally {
      setIsBusy(false);
    }
  };

  const onRemove = async () => {
    setIsBusy(true);
    try {
      const { version } = await deleteLocationDescriptionImage(location._id);
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
      await syncLocationImageMetadata(locationCell, {
        hasDescriptionImage: false,
        descriptionImageMime: undefined,
        version,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setIsBusy(false);
    }
  };

  const imageSrc =
    previewUrl ??
    (location.hasDescriptionImage
      ? locationDescriptionImageUrl(location._id, location.version)
      : null);

  return (
    <div flex column gap={2}>
      {imageSrc && (
        <img
          key={previewUrl ?? `${location._id}-${location.version}`}
          className={Styles.descriptionImagePreview}
          src={imageSrc}
          alt=""
        />
      )}
      <input
        id={fileInputId}
        className={Styles.fileInputHidden}
        type="file"
        accept="image/*"
        disabled={isBusy}
        onChange={onFileChange}
        name=""
      />
      <label
        htmlFor={fileInputId}
        className={[ButtonStyles.button, ButtonStyles.frame, "w-full"].join(" ")}
        style={isBusy ? { pointerEvents: "none", opacity: 0.3 } : undefined}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <SvgIcon id="#plus" />
        {location.hasDescriptionImage || previewUrl
          ? "Заменить фото"
          : "Добавить фото"}
      </label>
      {(location.hasDescriptionImage || previewUrl) && (
        <Button
          type="frame"
          buttonType="button"
          class="w-full"
          disabled={isBusy}
          onClick={onRemove}
        >
          <SvgIcon id="#trash" /> Удалить фото
        </Button>
      )}
    </div>
  );
};

const ContentBlockEdit: FunctionalComponent<{
  locationCell: Cell<InsomniaLocation>;
  index: number;
}> = (props) => {
  const location = useCell(props.locationCell);
  location.contentBlocks ??= [];
  const block = location.contentBlocks[props.index];
  const remove = () =>
    props.locationCell.set({
      ...location,
      contentBlocks: [
        ...location.contentBlocks.slice(0, props.index),
        ...location.contentBlocks.slice(props.index + 1),
      ],
    });
  const add = () =>
    props.locationCell.set({
      ...location,
      contentBlocks: [
        ...location.contentBlocks.slice(0, props.index),
        {
          blockType: "text",
          content: "",
        },
        ...location.contentBlocks.slice(props.index),
      ],
    });
  const patch = (patch: Partial<ContentBlock>) =>
    props.locationCell.set({
      ...location,
      contentBlocks: [
        ...location.contentBlocks.slice(0, props.index),
        {
          ...block,
          ...patch,
        } as ContentBlock,
        ...location.contentBlocks.slice(props.index + 1),
      ],
    });
  return (
    <>
      <div
        flex
        gap="2"
        center
        style={{ marginTop: 16 }}
        class="textSmall colorMediumBlue"
      >
        <span
          onClick={() =>
            patch({ blockType: block.blockType === "text" ? "link" : "text" })
          }
        >
          {block.blockType === "text" ? "Текст" : "Ссылка"}
        </span>
        <span>{props.index}</span>
        <SvgIcon id="#trash" onClick={remove}></SvgIcon>
        <Button style={{ padding: 0 }} type="text" onClick={add}>
          <SvgIcon id="#plus"></SvgIcon>добавить выше
        </Button>
      </div>
      {block.blockType === "text" && (
        <Input
          value={block.content}
          onChange={(e) => patch({ content: e.currentTarget.value })}
        />
      )}
      {block.blockType === "link" && (
        <>
          <Input
            value={block.link}
            onChange={(e) => patch({ link: e.currentTarget.value })}
          />
          <Input
            value={block.title}
            onChange={(e) => patch({ title: e.currentTarget.value })}
          />
        </>
      )}
    </>
  );
};
