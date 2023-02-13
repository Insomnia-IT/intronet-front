import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tag,
  Textarea,
  useToast,
  VStack,
} from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import React, { FC, useEffect } from "react";
import { locationsStore } from "src/stores/locations.store";
import { ModalProps } from ".";
import { getIconByDirectionId } from "../../pages/map/icons/icons";
import { directionsStore } from "../../stores";
import { useCellState } from "../../helpers/cell-state";

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
export const LocationModal: FC<ModalProps<InsomniaLocation>> = ({
  id,
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
  const toast = useToast();

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
      <ModalOverlay />
      <ModalContent>
        <ModalHeader></ModalHeader>
        <Formik
          initialValues={
            {
              id: id ?? null,
              name: name ?? "",
              description: description ?? "",
              directionId: directionId ?? 0,
              tags: tags ?? [],
              x: x ?? "",
              y: y ?? "",
              lat: lat ?? "",
              lon: lon ?? "",
            } as InsomniaLocation
          }
          onSubmit={(newLocation) => modalProps.success(newLocation)}
        >
          {(props) => (
            <Form key="form">
              <ModalBody>
                <VStack gap="4" alignItems="unset">
                  <FormControl isRequired>
                    <FormLabel htmlFor="name">Название локации</FormLabel>
                    <Field as={Input} id="name" name="name" type="text" />
                  </FormControl>
                  <FormControl>
                    <FormLabel htmlFor="description">
                      Описание локации
                    </FormLabel>
                    <Field
                      as={Textarea}
                      id="description"
                      name="description"
                      type="text"
                      height="20"
                    />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel htmlFor="lat">Широта</FormLabel>
                    <Field as={Input} id="lat" name="lat" type="number" />
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel htmlFor="lon">Долгота</FormLabel>
                    <Field as={Input} id="lon" name="lon" type="number" />
                  </FormControl>
                  <Button
                    onClick={() => {
                      props.setFieldValue("lat", center.lat);
                      props.setFieldValue("lon", center.lon);
                      props.setFieldValue("x", centerXY.x);
                      props.setFieldValue("y", centerXY.y);
                    }}
                  >
                    Поставить по центру карты
                  </Button>
                  <FormControl>
                    <FormLabel htmlFor="image">Значок</FormLabel>
                    <Flex flexWrap="wrap">
                      {direcitons.map((direction: Direction) => (
                        <svg
                          width={36}
                          height={36}
                          viewBox="-15 -15 30 30"
                          key={direction.id}
                          style={{
                            flex: "auto",
                            border:
                              direction.id === props.values.directionId
                                ? "solid 1px"
                                : undefined,
                          }}
                          onClick={() =>
                            props.setFieldValue("directionId", direction.id)
                          }
                        >
                          {getIconByDirectionId(direction.id)}
                        </svg>
                      ))}
                    </Flex>
                  </FormControl>

                  <FormControl>
                    <FormLabel htmlFor="tags">Тэги</FormLabel>
                    <HStack
                      align="center"
                      flexWrap="wrap"
                      flexDirection="row"
                      overflowX="scroll"
                    >
                      {locationsStore.Tags.toArray().map((tag) => {
                        return (
                          <Tag
                            id="tags"
                            key={tag.id}
                            size="lg"
                            borderRadius="full"
                            variant={
                              props.values.tags.includes(tag.id)
                                ? "solid"
                                : "outline"
                            }
                            onClick={() => {
                              const tags = new Set(props.values.tags);
                              if (tags.has(tag.id)) {
                                tags.delete(tag.id);
                              } else {
                                tags.add(tag.id);
                              }
                              props.setFieldValue("tags", Array.from(tags));
                            }}
                          >
                            {tag.name}
                          </Tag>
                        );
                      })}
                    </HStack>
                  </FormControl>
                </VStack>
              </ModalBody>
              <ModalFooter>
                <HStack width="full" justifyContent="space-between">
                  <Box>
                    <Button
                      variant="solid"
                      colorScheme="red"
                      onClick={modalProps.abort}
                      disabled
                    >
                      Удалить
                    </Button>
                  </Box>
                  <Box>
                    <Button variant="ghost" mr={3} onClick={modalProps.abort}>
                      Отменить
                    </Button>
                    <Button
                      colorScheme="blue"
                      type="submit"
                      isLoading={props.isSubmitting}
                    >
                      Сохранить
                    </Button>
                  </Box>
                </HStack>
              </ModalFooter>
            </Form>
          )}
        </Formik>
      </ModalContent>
    </Modal>
  );
};
