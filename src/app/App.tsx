"use client"
import React, { useEffect } from 'react'
import { useColorModes } from '@coreui/react'
import './scss/style.scss'
import { useAppDispatch, useAppSelector } from 'app/hooks'
import Loading from './components/Loading'
import { useSession } from 'next-auth/react'

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))
const App = () => {
  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const storedTheme: string = useAppSelector((state) => state.theme) // 테마 store.tsx
  const { data } = useSession();
  const dispatch = useAppDispatch()

  useEffect(() => {
    if(data?.user) {
      dispatch({ type: 'set', userInfo: data?.user })
    }

    const theme = "";
    if (theme) {
      setColorMode(theme)
    }

    if (isColorModeSet()) {
      return
    }

    setColorMode(storedTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Loading>
      <DefaultLayout />
    </Loading>
)
}

export default App
