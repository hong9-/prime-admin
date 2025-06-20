import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilSpeedometer,
  cilCalendar,
  cilPeople,
  cilList,
  cilMobile,
} from '@coreui/icons'
import { CNavItem } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: '요약',
    href: '/',
    className: 'nav-link',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    // badge: {
    //   color: 'info',
    //   text: 'ADMIN',
    // },
  },
  {
    component: CNavItem,
    name: '일정 목록',
    href: '/ScheduleTable',
    className: 'nav-link',
    icon: <CIcon icon={cilList} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'ADMIN',
    },
  },
  {
    component: CNavItem,
    name: '일정',
    href: '/ScheduleList',
    className: 'nav-link',
    icon: <CIcon icon={cilCalendar} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: '직원관리',
    href: '/UserList',
    className: 'nav-link',
    icon: <CIcon icon={cilPeople} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: '홈 화면에 추가',
    className: 'nav-link',
    icon: <CIcon icon={cilMobile} customClassName="nav-icon" />,
  },
]

export default _nav
