import {
  Box,
  Button,
  Flex,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Stack,
} from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import React, { FC } from "react";

export type LoginFormTokenProps = {
  onSubmit?: (token: User["token"]) => void;
  onCancel?: () => void;
} & { token?: User["token"] };

export const LoginFormToken: FC<LoginFormTokenProps> = ({
  token,
  onSubmit,
}) => {
  return (
    <Formik
      initialValues={{ token }}
      onSubmit={({ token: newToken }) => onSubmit(newToken)}
    >
      {(props) => (
        <Form key="form">
          <Flex align={"center"} justify={"center"}>
            <Stack spacing={8}>
              <Stack align={"center"}>
                <Heading fontSize={"4xl"}>Войдите в Ваш аккаунт</Heading>
              </Stack>
              <Box rounded={"lg"}>
                <Stack spacing={4}>
                  <FormControl>
                    <FormLabel htmlFor="token">Токен</FormLabel>
                    <Field
                      as={Input}
                      id="token"
                      name="token"
                      type="text"
                      placeholder="YourToken"
                    />
                    <FormHelperText>
                      Токен выдается штабом.
                    </FormHelperText>
                  </FormControl>
                  <Button
                    bg={"blue.400"}
                    color={"white"}
                    _hover={{
                      bg: "blue.500",
                    }}
                    onClick={() => onSubmit(props.values.token)}
                  >
                    Войти
                  </Button>
                </Stack>
              </Box>
            </Stack>
          </Flex>
        </Form>
      )}
    </Formik>
  );
};
