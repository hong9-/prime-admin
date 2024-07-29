import React from 'react'
import { NavLink } from 'react-router-dom'
import PropTypes from 'prop-types'

import SimpleBar from 'simplebar-react'
import 'simplebar-react/dist/simplebar.min.css'

import { CBadge, CNavLink, CSidebarNav } from '@coreui/react'
import { Role } from '@prisma/client';

interface prop {
  items?: Array<any>,
}

import Link from 'next/link'
import { useSession } from 'next-auth/react'

export const AppSidebarNav = (props:prop) => {
  const { data } = useSession();
  const { items } = props;
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
    const Component = component
    return (
      <Component as="div" key={index}>
        {(rest.to || rest.href) && (data?.user?.role === Role.ADMIN || !badge) ? (
          <Link {...(rest.to && { as: NavLink })} {...rest}>
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
