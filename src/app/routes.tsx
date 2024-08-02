import React, { LazyExoticComponent } from 'react'

const ScheduleTable = React.lazy(()=> import('./views/ScheduleTable'))
const ScheduleList = React.lazy(() => import('./views/ScheduleList'))
const UserList = React.lazy(() => import('./views/UserList'))
const Dashboard = React.lazy(() => import('app/views/Dashboard'))

export interface route {
  path: string,
  exact?: boolean,
  name?: string,
  element: LazyExoticComponent<() => React.JSX.Element> | React.JSX.ElementType,
}
const routes: Array<route> = [
  // { path: '/', exact: true, name: 'Home', element: ()=><></>},
  { path: '/', exact: true, name: 'Dashboard', element: Dashboard },
  { path: '/ScheduleTable', exact: true, name: '계약목록', element: ScheduleTable},
  { path: '/ScheduleTable/', exact: false, name: '계약목록 상세', element: ScheduleTable},
  { path: '/ScheduleList', exact: true, name: '방문일정', element: ScheduleList},
  { path: '/ScheduleList/', exact: false, name: '방문일정 상세', element: ScheduleList},
  { path: '/UserList', exact: true, name: '직원관리', element: UserList},
]

export default routes
