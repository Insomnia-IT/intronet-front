import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  HStack,
  Input,
  Switch,
  Textarea,
  VStack,
} from "@chakra-ui/react";
import { Field, Form, Formik } from "formik";
import React, { FC } from "preact/compat";

export type ScheduleElementFormProps = {
  onSubmit?: (schedule: Partial<AuditoryElement>) => void;
  onCancel?: () => void;
} & { auditoryElement?: Partial<AuditoryElement> };

export const ScheduleElementForm: FC<ScheduleElementFormProps> = ({
  auditoryElement,
  onSubmit,
  onCancel,
}) => {
  return (
    <div></div>

    // <Formik initialValues={{ ...auditoryElement }} onSubmit={onSubmit}>
    //   {(props) => (
    //     <Form key="form">
    //       <VStack spacing="4">
    //         <FormControl isRequired>
    //           <FormLabel htmlFor="name">Время</FormLabel>
    //           <Field
    //             as={Input}
    //             id="time"
    //             name="time"
    //             type="string"
    //             placeholder="00:00"
    //             validate={(value: string) => {
    //               let errorMessage: string;
    //               if (!/^([01][0-9]|2[0-3]):([0-5][0-9])$/.test(value)) {
    //                 errorMessage =
    //                   "Время должно быть записано в 24-ти часовом формате! ЧЧ:ММ";
    //               }
    //               return errorMessage;
    //             }}
    //           />
    //         </FormControl>
    //         <FormControl isRequired>
    //           <FormLabel htmlFor="name">Название</FormLabel>
    //           <Field as={Input} id="name" name="name" type="text" />
    //         </FormControl>
    //         <FormControl>
    //           <FormLabel htmlFor="name">Спикер</FormLabel>
    //           <Field as={Input} id="speaker" name="speaker" type="text" />
    //         </FormControl>
    //         <FormControl>
    //           <FormLabel htmlFor="description">Описание</FormLabel>
    //           <Field
    //             as={Textarea}
    //             id="description"
    //             name="description"
    //             type="text"
    //             h="20"
    //           />
    //         </FormControl>
    //         <FormControl isDisabled={!auditoryElement?.name}>
    //           <FormLabel htmlFor="isCanceled">Отменен</FormLabel>
    //           <Field as={Switch} id="isCanceled" name="isCanceled" />
    //           {props.values.isCanceled && (
    //             <FormHelperText>
    //               Событие отмечено, как отмененное.
    //             </FormHelperText>
    //           )}
    //         </FormControl>
    //         <HStack width="full" alignItems="flex-end">
    //           <Box>
    //             <Button variant="ghost" mr={3} onClick={onCancel}>
    //               Отменить
    //             </Button>
    //             <Button
    //               colorScheme="blue"
    //               type="submit"
    //               isLoading={props.isSubmitting}
    //             >
    //               Сохранить
    //             </Button>
    //           </Box>
    //         </HStack>
    //       </VStack>
    //     </Form>
    //   )}
    // </Formik>
  );
};
