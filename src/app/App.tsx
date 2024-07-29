"use client"
import React, { useEffect } from 'react'
import { CSpinner, useColorModes } from '@coreui/react'
import './scss/style.scss'
import { useAppSelector } from 'app/hooks'
import Loading from './components/Loading'

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
// const Login = React.lazy(() => import('./views/Login'))
// const Register = React.lazy(() => import('./views/pages/register/Register'))
// const ScheduleList = React.lazy(() => import('./views/ScheduleList'))
// const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
// const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))

const App = () => {
  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const storedTheme: string = useAppSelector((state) => state.theme) // 테마 store.tsx
  // let session = undefined;

  useEffect(() => {
    // const urlParams = new URLSearchParams(window.location.href.split('?')[1])
    // const theme = urlParams.get('theme') && urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0]
    const theme = "";
    if (theme) {
      setColorMode(theme)
    }

    if (isColorModeSet()) {
      return
    }

    setColorMode(storedTheme)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Loading>
      <DefaultLayout />
      {/* <div className="pt-3 ajax-loading text-center">
        <CSpinner color="primary" variant="grow" />
      </div> */}
    </Loading>
)
}

export default App
