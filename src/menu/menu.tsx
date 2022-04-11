import React from "react";
import {Link} from "wouter";
import {Button, Menu as BulmaMenu} from "react-bulma-components";

export function Menu() {
  return (
    <BulmaMenu>
      <BulmaMenu.List>
        <BulmaMenu.List.Item to="/map" renderAs={Link}>Карта </BulmaMenu.List.Item>
        <BulmaMenu.List.Item to="/timetable" renderAs={Link}>Расписание </BulmaMenu.List.Item>
        <BulmaMenu.List.Item to="/voting" renderAs={Link}>Голосование </BulmaMenu.List.Item>
        <BulmaMenu.List.Item to='/board' renderAs={Link}> Доска объявлений </BulmaMenu.List.Item>
      </BulmaMenu.List>
    </BulmaMenu>
  )
}
