import React, { FunctionalComponent } from "preact";
import { ModalProps } from ".";
import { directionsStore } from "@stores";
import { useCellState } from "@helpers/cell-state";
import { toast} from "@components";
import {Modal} from "@components/modal";
import {useEffect} from "preact/hooks";

const center = {
  lat: 54.68008397222222,
  lon: 35.08622484722222,
};
const centerXY = {
  x: 5512 / 2,
  y: 3892 / 2,
};

/**
 * Модальное окно, которое позволяет добавлять/редактировать/удалять локации
 */
export const LocationModal: FunctionalComponent<ModalProps<InsomniaLocation>> = ({
  _id,
  name,
  description,
  directionId,
  tags,
  x = centerXY.x, // середина карты
  y = centerXY.y,
  lat = center.lat,
  lon = center.lon,
  ...modalProps
}) => {
  useEffect(() => {
    (async () => {
      try {
        await directionsStore.getAll();
      } catch (error) {
        toast({
          title: "Ошибка получения направления.",
          description: error.message,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    })();
  }, [toast]);

  const [direcitons] = useCellState(() => directionsStore.Directions.toArray());

  return (
    <Modal
      isOpen={modalProps.show}
      onClose={modalProps.abort}
      scrollBehavior="outside"
    >
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Header></Modal.Header>
        {/*<Formik*/}
        {/*  initialValues={*/}
        {/*    {*/}
        {/*      _id: _id ?? null,*/}
        {/*      name: name ?? "",*/}
        {/*      description: description ?? "",*/}
        {/*      directionId: directionId ?? 0,*/}
        {/*      tags: tags ?? [],*/}
        {/*      x: x ?? "",*/}
        {/*      y: y ?? "",*/}
        {/*      lat: lat ?? "",*/}
        {/*      lon: lon ?? "",*/}
        {/*    } as InsomniaLocation*/}
        {/*  }*/}
        {/*  onSubmit={(newLocation) => modalProps.success(newLocation)}*/}
        {/*>*/}
        {/*  {(props) => (*/}
        {/*    <Form key="form">*/}
        {/*      <Modal.Body>*/}
        {/*        <div>*/}
        {/*          <label>*/}
        {/*            <div htmlFor="name">Название локации</div>*/}
        {/*            <input required id="name" name="name" type="text" />*/}
        {/*          </label>*/}
        {/*          <label>*/}
        {/*            <div htmlFor="description">*/}
        {/*              Описание локации*/}
        {/*            </div>*/}
        {/*            <textarea*/}
        {/*              id="description"*/}
        {/*              name="description"*/}
        {/*              style={{height:20}}*/}
        {/*            />*/}
        {/*          </label>*/}

        {/*          <label>*/}
        {/*            <div htmlFor="lat">Широта</div>*/}
        {/*            <input required id="lat" name="lat" type="number" />*/}
        {/*          </label>*/}

        {/*          <label >*/}
        {/*            <div htmlFor="lon">Долгота</div>*/}
        {/*            <input required id="lon" name="lon" type="number" />*/}
        {/*          </label>*/}
        {/*          <Button*/}
        {/*            onClick={() => {*/}
        {/*              props.setFieldValue("lat", center.lat);*/}
        {/*              props.setFieldValue("lon", center.lon);*/}
        {/*              props.setFieldValue("x", centerXY.x);*/}
        {/*              props.setFieldValue("y", centerXY.y);*/}
        {/*            }}*/}
        {/*          >*/}
        {/*            Поставить по центру карты*/}
        {/*          </Button>*/}
        {/*          <label>*/}
        {/*            <div htmlFor="image">Значок</div>*/}
        {/*            <div flexWrap="wrap">*/}
        {/*              {direcitons.map((direction: Direction) => (*/}
        {/*                <svg*/}
        {/*                  width={36}*/}
        {/*                  height={36}*/}
        {/*                  viewBox="-15 -15 30 30"*/}
        {/*                  key={direction._id}*/}
        {/*                  style={{*/}
        {/*                    flex: "auto",*/}
        {/*                    border:*/}
        {/*                      direction._id === props.values.directionId*/}
        {/*                        ? "solid 1px"*/}
        {/*                        : undefined,*/}
        {/*                  }}*/}
        {/*                  onClick={() =>*/}
        {/*                    props.setFieldValue("directionId", direction._id)*/}
        {/*                  }*/}
        {/*                >*/}
        {/*                  {getIconByDirectionId(direction._id)}*/}
        {/*                </svg>*/}
        {/*              ))}*/}
        {/*            </div>*/}
        {/*          </label>*/}

        {/*          <label>*/}
        {/*            <div htmlFor="tags">Тэги</div>*/}
        {/*            <div*/}
        {/*              align="center"*/}
        {/*              flexWrap="wrap"*/}
        {/*              flexDirection="row"*/}
        {/*              overflowX="scroll"*/}
        {/*            >*/}
        {/*              {locationsStore.Tags.toArray().map((tag) => {*/}
        {/*                return (*/}
        {/*                  <div*/}
        {/*                    id="tags"*/}
        {/*                    key={tag._id}*/}
        {/*                    size="lg"*/}
        {/*                    borderRadius="full"*/}
        {/*                    variant={*/}
        {/*                      props.values.tags.includes(tag._id)*/}
        {/*                        ? "solid"*/}
        {/*                        : "outline"*/}
        {/*                    }*/}
        {/*                    onClick={() => {*/}
        {/*                      const tags = new Set<string>(props.values.tags);*/}
        {/*                      if (tags.has(tag._id)) {*/}
        {/*                        tags.delete(tag._id);*/}
        {/*                      } else {*/}
        {/*                        tags.add(tag._id);*/}
        {/*                      }*/}
        {/*                      props.setFieldValue("tags", Array.from(tags));*/}
        {/*                    }}*/}
        {/*                  >*/}
        {/*                    {tag.name}*/}
        {/*                  </div>*/}
        {/*                );*/}
        {/*              })}*/}
        {/*            </div>*/}
        {/*          </label>*/}
        {/*        </div>*/}
        {/*      </Modal.Body>*/}
        {/*      <Modal.Footer>*/}
        {/*        <div width="full" >*/}
        {/*          <div>*/}
        {/*            <Button solid*/}
        {/*              onClick={modalProps.abort}*/}
        {/*              disabled*/}
        {/*            >*/}
        {/*              Удалить*/}
        {/*            </Button>*/}
        {/*          </div>*/}
        {/*          <div>*/}
        {/*            <Button onClick={modalProps.abort}>*/}
        {/*              Отменить*/}
        {/*            </Button>*/}
        {/*            <Button*/}
        {/*              type="submit"*/}
        {/*              isLoading={props.isSubmitting}*/}
        {/*            >*/}
        {/*              Сохранить*/}
        {/*            </Button>*/}
        {/*          </div>*/}
        {/*        </div>*/}
        {/*      </Modal.Footer>*/}
            {/*</Form>*/}
          {/*)}*/}
        {/*</Formik>*/}
      </Modal.Content>
    </Modal>
  );
};
