import {
  Box,
  Button,
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
import { directionsStore } from "src/stores";
import { locationsStore } from "src/stores/locations.store";
import { ModalProps } from ".";
import { getIconByDirectionId } from "../../pages/map/icons/icons";

const center = {
  lat: 54.68008397222222,
  lon: 35.08622484722222,
};

/**
 * Модальное окно, которое позволяет добавлять/редактировать/удалять локации
 */
export const LocationModal: FC<ModalProps<InsomniaLocationFull>> = ({
  id,
  name,
  description,
  directionId,
  tags,
  x = 640, // середина карты
  y = 455,
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
  }, []);

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
            } as InsomniaLocationFull
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

                  {/*<FormControl isRequired>*/}
                  {/*  <FormLabel htmlFor="x">Координаты Х</FormLabel>*/}
                  {/*  <Field as={Input} id="x" name="x" type="number" />*/}
                  {/*</FormControl>*/}

                  {/*<FormControl isRequired>*/}
                  {/*  <FormLabel htmlFor="y">Координаты Y</FormLabel>*/}
                  {/*  <Field as={Input} id="y" name="y" type="number" />*/}
                  {/*</FormControl>*/}

                  {/*<FormControl isRequired>*/}
                  {/*  <FormLabel htmlFor="lat">Широта</FormLabel>*/}
                  {/*  <Field as={Input} id="lat" name="lat" type="number" />*/}
                  {/*</FormControl>*/}

                  {/*<FormControl isRequired>*/}
                  {/*  <FormLabel htmlFor="lon">Долгота</FormLabel>*/}
                  {/*  <Field as={Input} id="lon" name="lon" type="number" />*/}
                  {/*</FormControl>*/}
                  {/*<Button*/}
                  {/*  onClick={() => {*/}
                  {/*    props.setFieldValue("lat", center.lat);*/}
                  {/*    props.setFieldValue("lon", center.lon);*/}
                  {/*  }}*/}
                  {/*>*/}
                  {/*  To Сenter*/}
                  {/*</Button>*/}
                  <FormControl>
                    <FormLabel htmlFor="image">Значок</FormLabel>
                    <HStack>
                      {directionsStore.Directions.toArray().map((direction) => (
                        <svg
                          width={24}
                          height={24}
                          viewBox="-15 -15 30 30"
                          key={direction.id}
                          style={{
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
                    </HStack>
                  </FormControl>

                  <FormControl>
                    <FormLabel htmlFor="tags">Тэги</FormLabel>
                    <HStack
                      align="center"
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
                              props.values.tags
                                // @ts-ignore
                                .includes(tag.id)
                                ? "solid"
                                : "outline"
                            }
                            onClick={() =>
                              props.setFieldValue("tags", [tag.id])
                            }
                          >
                            {tag.name}
                          </Tag>
                        );
                      })}
                    </HStack>
                  </FormControl>
                </VStack>
                {/* <Box as="pre" marginY={10}>
                  {JSON.stringify(props.values, null, 2)}
                  <br />
                  {JSON.stringify(props.errors, null, 2)}
                </Box> */}
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
