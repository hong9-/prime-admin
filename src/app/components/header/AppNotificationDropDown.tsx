'use client'

import React, { useEffect } from 'react'
import {
  CDropdown,
  CDropdownHeader,
  CDropdownItem,
  CDropdownItemPlain,
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
  cilBellExclamation,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'

import avatar8 from 'assets/images/avatars/8.jpg'
import { SessionContextValue, signOut, useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import { Notification } from "auth";
import { CDropdownContext } from '@coreui/react/dist/esm/components/dropdown/CDropdown'

const exampleNotifications: Array<Notification> = [
  {
    id: '1234',
    message: '알림내용 짤븡거',
    link: 'http://localhost',
    confirmed: true,
  }, {
    id: '5678',
    message: '알림내용 긴거긴거긴거긴거 긴거긴거긴거긴거 긴거긴거긴거긴거 긴거긴거긴거긴거 긴거긴거긴거긴거',
    link: 'http://localhost',
    confirmed: false,
  }, {
    id: '9012',
    message: '알림내용 긴거긴거긴거긴거긴거긴거긴거긴거긴거긴거긴거긴거긴거긴거긴거긴거긴거긴거긴거긴거긴거긴거긴거긴거',
    link: 'http://localhost',
    confirmed: true,
  }, {
    id: '3456',
    message: '알림내용 짤븡거',
    link: 'http://localhost',
    confirmed: false,
  }
]
const AppNotificationDropdown = () => {
  const { data } = useSession();
  useEffect(()=>{}, [])

  const notiList:Array<Notification> = data?.user?.notifications || exampleNotifications;
  const onClick = (noti: Notification)=>{
    console.log(noti);
    // redirect('/Schedule/')
  }

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle  className="" caret={false}>
        <CIcon icon={cilBell} size="lg" />
        {/* <CIcon icon={cilUser} className="md" /> */}
        {/* <CAvatar src={avatar8.src} size="md" /> */}
      </CDropdownToggle>
      <CDropdownMenu className="pt-0 notifications" >
        {/* <CDropdownHeader className="bg-body-secondary fw-semibold mb-2">알림</CDropdownHeader> */}
        {notiList.map((noti: Notification, i: number)=> (
          <>
            <CDropdownItem
              key={i}
              className={(noti.confirmed ? "confirmed" : "")}
              onClick={()=>onClick(noti)}>
              <CIcon icon={noti.confirmed ? cilBellExclamation : cilBell } className="me-2" />
              {noti.message}
              <div className="notification-timestamp">2012/03/05 07:35</div>
            </CDropdownItem>
          </>
        ))}
      </CDropdownMenu>
    </CDropdown>
  )
}

export default React.memo(AppNotificationDropdown)
