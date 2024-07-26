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
    const targetRoute:route = routes.find((target)=> currentLocation === target.path) || defaultRoute;
    const Route:LazyExoticComponent<() => React.JSX.Element> | React.JSX.ElementType = targetRoute.element;
    return <Route></Route>;
  }

  return (
    <CContainer className="">
      <Suspense fallback={<CSpinner color="primary" />}>
        {<Component />}
        {/* <Routes>
          {routes.map((route, idx) => {
            return (
              route.element && (
                <Route
                  key={idx}
                  path={route.path}
                  // exact={route.exact}
                  // name={route.name}
                  element={<route.element />}
                />
              )
            )
          })}
          <Route path="/" element={<Navigate to="ScheduleList" replace />} />
        </Routes> */}
      </Suspense>
    </CContainer>
  )
}

export default React.memo(AppContent)
