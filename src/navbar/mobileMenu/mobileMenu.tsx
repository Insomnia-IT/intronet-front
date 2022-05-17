import React from 'react'
import styles from './mobileMenu.module.css'
import { Menu as BulmaMenu } from 'react-bulma-components'
import { Link } from 'wouter'
import { IMenuList, IMenuObject } from '../navbar'

interface IMobileMenuProps {
  menuList: IMenuList
  children: (handler: () => void, className: string) => React.ReactNode
}

export default function MobileMenu({ menuList, children }: IMobileMenuProps) {
  const [stylesMenu, setStylesMenu] = React.useState(styles.menu)
  const [stylesBurger, setStylesBurger] = React.useState('')

  const toggleMenu = () => {
    stylesMenu == styles.menu ? setStylesMenu(styles.menu + ' ' + styles.menuIsActive) : setStylesMenu(styles.menu)
    stylesBurger == '' ? setStylesBurger('is-active') : setStylesBurger('')
  }

  return (
    <>
      {children(toggleMenu, stylesBurger)}
      {stylesMenu != styles.menu && (
        <div className={styles.wrapper} onClick={toggleMenu}></div>
      )}
      <div className={stylesMenu}>
        <BulmaMenu>
          <BulmaMenu.List>
            {menuList.map((item: IMenuObject): React.ReactNode => {
              return <BulmaMenu.List.Item key={item.link} to={item.link} renderAs={Link} onClick={toggleMenu}>{item.text}</BulmaMenu.List.Item>
            })}
          </BulmaMenu.List>
        </BulmaMenu>
      </div>
    </>
  )
}
