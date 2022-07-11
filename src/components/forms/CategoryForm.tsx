import {
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
} from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import React, { FC } from "react";

export type CategoryFormProps = {
  onSubmit?: (category: ICategory) => void;
  onCancel?: () => void;
} & { category?: ICategory };

export const CategoryForm: FC<CategoryFormProps> = ({
  category,
  onSubmit,
  onCancel,
}) => {
  return (
    <Formik initialValues={{ ...category }} onSubmit={onSubmit}>
      {(props) => (
        <Form key="form">
          <FormControl isRequired>
            <FormLabel htmlFor="name">Наименование</FormLabel>
            <Field as={Input} id="name" name="name" type="string" />
          </FormControl>
          <HStack width="full" alignItems="flex-end" mt="4">
            <Box>
              <Button variant="ghost" mr={3} onClick={onCancel}>
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
        </Form>
      )}
    </Formik>
  );
};
