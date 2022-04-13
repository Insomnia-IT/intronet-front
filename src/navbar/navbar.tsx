import React from "react";
import { Link } from "wouter";
import { Navbar as BulmaNavbar } from "react-bulma-components";
import Logo from "../images/logo-black-100.png"
import styles from "./navbar.module.css"
import MobileMenu from "./mobileMenu/mobileMenu";

export interface IMenuObject extends Object {
  text: string;
  link: string
}

export interface IMenuList extends Array<object> {
  [index: number]: IMenuObject
}

export default function Navbar() {
  const menuList: IMenuList = [
    {
      text: 'Карта',
      link: '/map'
    },
    {
      text: 'Расписание',
      link: '/timetable'
    },
    {
      text: 'Голосование',
      link: '/voting'
    },
    {
      text: 'Доска объявлений',
      link: '/board'
    }
  ]

  return (
    <BulmaNavbar className={styles.navbar}>
      <BulmaNavbar.Brand className={styles.logo}>
        <BulmaNavbar.Item to="/" renderAs={Link}>
          <img
            src={Logo}
            alt="Бессоница"
            width="62"
            height="52"
          />
        </BulmaNavbar.Item>
        <MobileMenu menuList={menuList}>
          {(handler: () => void, className: string) => {
            return <BulmaNavbar.Burger onClick={handler} className={className}></BulmaNavbar.Burger>
          }}
        </MobileMenu>
      </BulmaNavbar.Brand>
      <BulmaNavbar.Menu>
        <BulmaNavbar.Container>
          {menuList.map((item: IMenuObject): React.ReactNode => {
            return <BulmaNavbar.Item to={item.link} renderAs={Link}>{item.text}</BulmaNavbar.Item>
          })}
        </BulmaNavbar.Container>
      </BulmaNavbar.Menu>
    </BulmaNavbar>
  )
}
