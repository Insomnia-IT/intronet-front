import { Tag } from "@chakra-ui/react";
import { IconButton } from "@chakra-ui/react";
import { VStack } from "@chakra-ui/react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  HStack,
  Input,
} from "@chakra-ui/react";
import { Select } from "chakra-react-select";
import { Field, Form, Formik } from "formik";
import React, { FC } from "react";

export type CategoryFormProps = {
  onSubmit?: (category: ICategory) => void;
  onCancel?: () => void;
} & { category?: ICategory };

const colors = [
{color:"#6bbdb0", name: 'Зелененький'},
{color:"#ffb746", name: 'Жельтенький'},
{color:"#44b8ff", name: 'Синенький'},
{color:"#9880f1", name: 'Фиолетовенький'},
{color:"#cbd5e0", name: 'Серенький'},
{color:"#e57287", name: 'Розовенький'},
]

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
          <FormControl>
            <FormControl>
              <FormLabel htmlFor="color">Цвет</FormLabel>
              <VStack spacing="4">

              {colors.map(c => (
                <Tag border={props.values.color === c.color ? '1px solid black': undefined} color={c.color}
                onClick={()=>props.setFieldValue('color', c.color)}
                >{c.name}</Tag>
                
                ))}
                </VStack>
            </FormControl>
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
