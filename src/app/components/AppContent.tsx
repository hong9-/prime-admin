"use client"
import React, { LazyExoticComponent } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'
// routes config
import routes, { route } from '../routes'
import { Router } from 'next/router'
import { usePathname } from 'next/navigation'
import Loading from './Loading'
import { useSession } from 'next-auth/react'
import { Role } from '@prisma/client'

const Dashboard = React.lazy(() => import('app/views/Dashboard'))

const AppContent = () => {
  const currentLocation = usePathname();
  const { data } = useSession();

  const Component = ()=> {
    const defaultRoute: route = {path: currentLocation, element: ()=><div>존재하지 않는 컴포넌트입니다.</div>};
    if(data?.user.role === Role.ADMIN)
      routes[0] = { path: '/', exact: true, name: 'Dashboard', element: Dashboard };
    
    const targetRoute:route = routes.find((target)=> {
      return target.exact ?
        currentLocation === target.path : 
        currentLocation.indexOf(target.path) > -1;
    }) || defaultRoute;
    const Route:LazyExoticComponent<() => React.JSX.Element> | React.JSX.ElementType = targetRoute.element;
    return <Route></Route>;
  }

  return (
    <CContainer className="">
      <Loading>
        <Component />
      </Loading>
    </CContainer>
  )
}

export default React.memo(AppContent)
