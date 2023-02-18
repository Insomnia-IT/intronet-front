import {
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
  VStack,
} from "@chakra-ui/react";
import { Field, FieldArray, Form, Formik } from "formik";
import React, { FC } from "react";

export type CategoriesFormProps = {
  onSubmit?: (categories: ICategory[]) => void;
  onCancel?: () => void;
} & { categories?: ICategory[] };

export const CategoriesForm: FC<CategoriesFormProps> = ({
  categories,
  onSubmit,
  onCancel,
}) => {
  return (
    <Formik
      initialValues={{ categories }}
      onSubmit={({ categories: cx }) => onSubmit(cx)}
    >
      {(props) => (
        <Form key="form">
          <FieldArray
            name="categories"
            render={(arrayHelpers) => (
              <VStack spacing="4">
                {props.values.categories &&
                  props.values.categories.map((category, index) => (
                    <FormControl key={category._id} isRequired>
                      <FormLabel htmlFor={`categories.${index}.id`}>
                        Наименование
                      </FormLabel>
                      <Field
                        as={Input}
                        id={`categories.${index}.id`}
                        name={`categories.${index}.name`}
                        type="string"
                        defaultValue=""
                      />
                    </FormControl>
                  ))}
              </VStack>
            )}
          />
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
