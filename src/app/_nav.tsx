import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilBell,
  cilCalculator,
  cilChartPie,
  cilCursor,
  cilDescription,
  cilDrop,
  cilNotes,
  cilPencil,
  cilPuzzle,
  cilSpeedometer,
  cilStar,
  cilCalendar,
  cilPeople,
  cilList,
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

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
]

export default _nav
