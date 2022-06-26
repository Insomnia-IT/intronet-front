import React, { FC } from "react";
import { DateTime } from "luxon";
import { Slot } from "./slot";
import { Box, Button } from "@chakra-ui/react";
import { useAppContext } from "src/helpers/AppProvider";
import { LoginModal } from "src/components";

export type TimetableProps = {
  list?: TimetableSlot[];
};

export const Timetable: FC<TimetableProps> = ({ list }) => {
  const app = useAppContext();

  const handleLogin = async () => {
    try {
      const user = await app.modals.show<Partial<User>>((props) => (
        <LoginModal {...props} />
      ));
      user.token && app.auth.setToken(user.token);
      user.ticketId && app.auth.setTicketId(user.ticketId);
    } catch (error) {
      if (error instanceof Error) {
        // TODO: вызывать кол к апи на проверку токена?
      }
    }
  };

  return (
    <>
      <span>Timetable</span>
      {list?.map((slot) => (
        <Slot key={slot.id} slot={slot} />
      ))}
      <Box pos="absolute" top="10" right="50%">
        <Button onClick={handleLogin}>Войти</Button>
      </Box>
    </>
  );
};

export type TimetableSlot = {
  id: string | number;
  Title: string;
  Start: DateTime;
  End: DateTime;
};
