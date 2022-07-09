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
import { useCellState } from "src/helpers/cell-state";
import { categoriesStore } from "src/stores";

export type NoteFormProps = {
  onSubmit?: (note: INote) => void;
  onCancel?: () => void;
} & { note?: INote };

export const NoteForm: FC<NoteFormProps> = ({ note, onSubmit }) => {
  const [categories] = useCellState(categoriesStore);
  return (
    <Formik initialValues={{ ...note }} onSubmit={onSubmit}>
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
            <FormControl>
              <FormLabel htmlFor="categoryId">Категория</FormLabel>
              <HStack>
                {categories.allCategory.map((category) => (
                  <Tag
                    key={category.id}
                    color={category.color}
                    onClick={() =>
                      props.setFieldValue("categoryId", category.id)
                    }
                    border={
                      category.id === props.values.categoryId
                        ? "1px"
                        : undefined
                    }
                  >
                    {category.name}
                  </Tag>
                ))}
              </HStack>
            </FormControl>
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
