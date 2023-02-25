import {
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Stack,
  Tag,
  Textarea,
} from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import React, { FC } from "react";
import { useCellState } from "@helpers/cell-state";
import { categoriesStore } from "@stores";
import { RequireAuth } from "../RequireAuth";

export type NoteFormProps = {
  onSubmit?: (note: Omit<INote, "createdDate" | "createdBy">) => void;
  onCancel?: () => void;
} & { note?: Omit<INote, "createdDate" | "createdBy"> };

export const NoteForm: FC<NoteFormProps> = ({ note, onSubmit }) => {
  const [categories] = useCellState(categoriesStore);
  return (
    <Formik initialValues={{ ...note, categoryId: '2' }} onSubmit={onSubmit}>
      {(props) => (
        <Form key="form">
          <Stack spacing={4}>
            <FormControl>
              <FormLabel htmlFor="title">Название</FormLabel>
              <Field
                as={Input}
                id="title"
                name="title"
                type="text"
                placeholder="Название объявления"
              />
            </FormControl>
            <FormControl>
              <FormLabel htmlFor="text">Содержимое</FormLabel>
              <Field
                as={Textarea}
                id="text"
                name="text"
                type="text"
                placeholder="Содержимое объявления"
                h="20"
              />
            </FormControl>
            <RequireAuth>
              <FormControl>
                <FormLabel htmlFor="categoryId">Категория</FormLabel>
                <HStack>
                  {categories.allCategory.map((category) => (
                    <Tag
                      key={category._id}
                      color={category.color}
                      onClick={() =>
                        props.setFieldValue("categoryId", category._id)
                      }
                      border={
                        category._id === props.values.categoryId
                          ? "1px"
                          : undefined
                      }
                    >
                      {category.name}
                    </Tag>
                  ))}
                </HStack>
              </FormControl>
            </RequireAuth>
            <Button
              bg={"blue.400"}
              color={"white"}
              _hover={{
                bg: "blue.500",
              }}
              onClick={() => onSubmit(props.values)}
            >
              Сохранить
            </Button>
          </Stack>
        </Form>
      )}
    </Formik>
  );
};
