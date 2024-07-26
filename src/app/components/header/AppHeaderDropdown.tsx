'use client'

import React, { useEffect } from 'react'
import {
  CAvatar,
  CBadge,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import {
  cilBell,
  cilCreditCard,
  cilCommentSquare,
  cilEnvelopeOpen,
  cilFile,
  cilLockLocked,
  cilSettings,
  cilTask,
  cilUser,
  cilAccountLogout,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'

import avatar8 from 'assets/images/avatars/8.jpg'
import { SignInAuthorizationParams, signOut, useSession } from 'next-auth/react'

const AppHeaderDropdown = () => {
  const onLogOut = async()=> {
    const result = await signOut({redirect: false});
    console.log(result);
  }

  let { data: sessionData  } = useSession();

  useEffect(()=>{}, [])

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle  className="" caret={false}>
        {sessionData?.user?.name+ '  '}
        <CIcon icon={cilUser} className="md" />
        {/* <CAvatar src={avatar8.src} size="md" /> */}
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
