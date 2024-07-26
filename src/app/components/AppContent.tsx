"use client"
import React, { LazyExoticComponent, Suspense } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'
// routes config
import routes, { route } from '../routes'
import { Router } from 'next/router'
import { usePathname } from 'next/navigation'


const AppContent = () => {
  const currentLocation = usePathname();

  const Component = ()=> {
    const defaultRoute: route = {path: currentLocation, element: ()=><div>존재하지 않는 컴포넌트입니다.</div>};
    // console.log(currentLocation, )
    const targetRoute:route = routes.find((target)=> {
      console.log(currentLocation, target.path)
      return target.exact ?
        currentLocation === target.path : 
        currentLocation.indexOf(target.path) > -1;
    }) || defaultRoute;
    const Route:LazyExoticComponent<() => React.JSX.Element> | React.JSX.ElementType = targetRoute.element;
    return <Route></Route>;
  }

  return (
    <CContainer className="">
      <Suspense fallback={<CSpinner color="primary" />}>
        <Component />
      </Suspense>
    </CContainer>
  )
}

export default React.memo(AppContent)
