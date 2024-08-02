import React from 'react'
import routes from '../routes'

import { CBreadcrumb, CBreadcrumbItem } from '@coreui/react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

const AppBreadcrumb = () => {
  const currentLocation = usePathname();
  
  const getRouteName = (pathname: string, routes: Array<any>) => {
    const currentRoute = routes.find((route) =>
      route.exact ? route.path === pathname : pathname.indexOf(route.path) > -1)
    return currentRoute ? currentRoute.name : false
  }

  const getBreadcrumbs = (location: string) => {
    const breadcrumbs:Array<any> = []
    location.split('/').reduce((prev, curr, index, array) => {
      const currentPathname = `${prev}/${curr}`
      const routeName = getRouteName(currentPathname, routes)
      routeName &&
        breadcrumbs.push({
          pathname: currentPathname,
          name: routeName,
          active: index + 1 === array.length ? true : false,
        })
      return currentPathname
    })
    console.log(breadcrumbs);
    return breadcrumbs
  }

  const breadcrumbs = getBreadcrumbs(currentLocation)

  return (
    <CBreadcrumb className="my-0">
      {/* <Link href="/"><CBreadcrumbItem>Home</CBreadcrumbItem></Link>
      {breadcrumbs.map((breadcrumb, index) => {
        return (
          <Link href={!breadcrumb.active || breadcrumb.pathname }>
          <CBreadcrumbItem
            {...(breadcrumb.active ? { active: true } : { href: breadcrumb.pathname })}
            key={index}
          >
            {breadcrumb.name}
          </CBreadcrumbItem>
          </Link>
        )
      })} */}
      <CBreadcrumbItem><Link href="/">Home</Link></CBreadcrumbItem>
      {breadcrumbs.map((breadcrumb, index) => {
        return (
          <CBreadcrumbItem
            {...(breadcrumb.active && { active: true })}
            key={index}
          >
            {breadcrumb.active
              ?
                breadcrumb.name
              :
                <Link href={breadcrumb.pathname}>{breadcrumb.name}</Link>
            }
          </CBreadcrumbItem>
        )
      })}
    </CBreadcrumb>
  )
}

export default React.memo(AppBreadcrumb)
