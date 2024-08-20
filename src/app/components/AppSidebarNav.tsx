import React, { useEffect, useRef, useState } from 'react'
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
import { eventListeners } from '@popperjs/core'

interface deferredPrompt {
  prompt: Function,
}
interface newWindow {
  appInstalled?: boolean,
  deferredPrompt: deferredPrompt,
}

export const AppSidebarNav = (props:prop) => {
  const { items } = props;
  let window = (global as newWindow & Window & typeof globalThis);
  const user: UserInfo = useAppSelector((state) => state.userInfo)
  const deferredPrompt = useRef<any>(null);
  const [ installed, setInstalled ] = useState(window.appInstalled);

  useEffect(()=>{
    if(!installed) {
      const handler = ()=> {
        setInstalled(true);
        console.log('app installed');
        window.removeEventListener('appinstalled', handler)
      }
      window.addEventListener('appinstalled', handler)
    }
  }, [])

  const handleInstallClick = () => {
    deferredPrompt.current = window.deferredPrompt;
    if (deferredPrompt.current) {
      deferredPrompt.current.prompt();
  
      deferredPrompt.current.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the A2HS prompt');
          deferredPrompt.current = null;
        } else {
          console.log('User dismissed the A2HS prompt');
        }
      });
    }
  };
  
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
    if (user.role !== Role.ADMIN) {
      if (name === '일정 목록' || name === '직원관리')
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
          <CNavLink hidden={installed} onClick={handleInstallClick}>{navLink(name, icon, badge, indent)}</CNavLink>
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
