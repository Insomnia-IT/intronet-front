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

export type LoginFormTicketProps = {
  onSubmit?: (ticketId: User["ticketId"]) => void;
  onCancel?: () => void;
} & { ticketId?: User["ticketId"] };

export const LoginFormTicket: FC<LoginFormTicketProps> = ({
  ticketId,
  onSubmit,
}) => {
  return (
    <Formik
      initialValues={{ ticketId }}
      onSubmit={({ ticketId: newTicketId }) => onSubmit(newTicketId)}
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
                  <FormControl id="email">
                    <FormLabel>Номер билета</FormLabel>
                    <Field
                      as={Input}
                      id="ticketId"
                      name="ticketId"
                      type="number"
                      placeholder="040811516234210800"
                    />
                    <FormHelperText>
                      17-ти значный номер находится на лицевой стороне билета.
                    </FormHelperText>
                  </FormControl>
                  <Button
                    bg={"blue.400"}
                    color={"white"}
                    _hover={{
                      bg: "blue.500",
                    }}
                    onClick={() => onSubmit(props.values.ticketId)}
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
