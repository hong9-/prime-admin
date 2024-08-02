"use client"
import React, { LazyExoticComponent } from 'react'
import { CContainer, CSpinner } from '@coreui/react'
// routes config
import routes, { route } from '../routes'
import { usePathname } from 'next/navigation'
import Loading from './Loading'

const AppContent = () => {
  const currentLocation = usePathname();

  const Component = ()=> {
    const defaultRoute: route = {path: currentLocation, element: ()=><div>존재하지 않는 컴포넌트입니다.</div>};
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
