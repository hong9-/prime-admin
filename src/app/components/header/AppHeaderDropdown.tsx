'use client'

import React, { useEffect } from 'react'
import {
  CDropdown,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import {
  cilUser,
  cilAccountLogout,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'

import { signOut } from 'next-auth/react'
import { UserInfo } from 'app/store'
import { useAppSelector } from 'app/hooks'

const AppHeaderDropdown = () => {
  const user: UserInfo = useAppSelector((state) => state.userInfo)
  const onLogOut = async()=> {
    const result = await signOut({redirect: false});
  }

  useEffect(()=>{}, [])

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle  className="" caret={false}>
        {user.name+ '  '}
        <CIcon icon={cilUser} className="md" />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" >
        <CDropdownHeader className="bg-body-secondary fw-semibold mb-2">계정</CDropdownHeader>
        <CDropdownItem onClick={onLogOut}>
          <CIcon icon={cilAccountLogout} className="me-2" />
          로그아웃
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
