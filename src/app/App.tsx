"use client"
import React, { Suspense, useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { CSpinner, useColorModes } from '@coreui/react'
import './scss/style.scss'
import { Router } from 'next/router'
import CreatePassword from './create-password'
import Login from './Login/page'
import { auth } from 'auth'
import { redirect, useRouter } from 'next/navigation'
import { useAppSelector } from 'app/hooks'
// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
// const Login = React.lazy(() => import('./views/Login'))
// const Register = React.lazy(() => import('./views/pages/register/Register'))
const Calendar = React.lazy(() => import('./views/Calendar'))
// const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
// const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))

const App = () => {
  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const storedTheme: string = useAppSelector((state) => state.theme) // 테마 store.tsx
  // let session = undefined;

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.href.split('?')[1])
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
      <Suspense
        fallback={
          <div className="pt-3 page-loading text-center">
            <CSpinner color="primary" variant="grow" />
          </div>
        }
      >
        <DefaultLayout />
        {/* <Routes>
          <Route path='/Login' element={<Login />}/>
          <Route path='/CreatePassword' element={<CreatePassword />}/>
          <Route path='*' element={<DefaultLayout />}/>
          <Route path="*" name="Home" element={<DefaultLayout />}/>
        </Routes> */}
      </Suspense>
  )
}

export default App
