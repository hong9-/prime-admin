import React from 'react'
import PropTypes from 'prop-types'

import SimpleBar from 'simplebar-react'
import 'simplebar-react/dist/simplebar.min.css'

import { CBadge, CNavLink, CSidebarNav } from '@coreui/react'
import { Role } from '@prisma/client';

interface prop {
  items?: Array<any>,
}

import Link from 'next/link'
import { useAppSelector } from 'app/hooks'
import { UserInfo } from 'app/store'

export const AppSidebarNav = (props:prop) => {
  const { items } = props;
  const user: UserInfo = useAppSelector((state) => state.userInfo)

  const navLink = (name: string, icon: string, badge: any, indent: boolean | undefined = false) => {
    return (
      <>
        {icon
          ? icon
          : indent && (
              <span className="nav-icon">
                <span className="nav-icon-bullet"></span>
              </span>
            )}
        {name && name}
        {badge && (
          <CBadge color={badge.color} className="ms-auto">
            {badge.text}
          </CBadge>
        )}
      </>
    )
  }

  const navItem = (item: any, index:number, indent = false) => {
    const { component, name, badge, icon, ...rest } = item
    if (user.role === Role.SALES) {
      if (name === '직원관리')
        return null;
    }

    const Component = component
    return (
      <Component as="div" key={index}>
        {(rest.to || rest.href) && (user.role === Role.ADMIN || !badge) ? (
          <Link {...(rest.to && { as: CNavLink })} {...rest}>
            {navLink(name, icon, badge, indent)}
          </Link>
        ) : (
          null
        )}
      </Component>
    )
  }

  const navGroup = (item: any, index: number) => {
    const { component, name, icon, items, to, badge, ...rest } = item
    const Component = component
    return (
      <Component compact as="div" key={index} toggler={navLink(name, icon, badge)} {...rest}>
        {item.items?.map((item: any, index: number) =>
          item.items ? navGroup(item, index) : navItem(item, index, true),
        )}
      </Component>
    )
  }

  return (
    <CSidebarNav as={SimpleBar}>
      {items &&
        items.map((item, index) => (item.items ? navGroup(item, index) : navItem(item, index)))}
    </CSidebarNav>
  )
}

AppSidebarNav.propTypes = {
  items: PropTypes.arrayOf(PropTypes.any).isRequired,
}
