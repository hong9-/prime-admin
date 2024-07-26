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
import { Notification } from "app/store";
import { CDropdownContext } from '@coreui/react/dist/esm/components/dropdown/CDropdown'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

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
  const router = useRouter()
  useEffect(()=>{}, [])

  const notiList:Array<Notification> = data?.user?.Notifications || exampleNotifications;
  const onClick = (noti: Notification)=>{
    console.log(noti);
    router.push(noti.link);
    // redirect('/Schedule/')
  }

  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle  className="" caret={false} disabled={notiList.length === 0}>
        <CIcon icon={cilBell} size="lg" />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0 notifications" >
        {/* <CDropdownHeader className="bg-body-secondary fw-semibold mb-2">알림</CDropdownHeader> */}
        {notiList.map((noti: Notification, i: number)=> (
          <CDropdownItem
            key={i}
            className={(noti.confirmed ? "confirmed" : "")}
            onClick={()=>onClick(noti)}>
            {/* <Link href={`/ScheduleList/${noti.id}`}> */}
              <CIcon icon={noti.confirmed ? cilBellExclamation : cilBell } className="me-2" />
              {noti.message}
              <div className="notification-timestamp">2012/03/05 07:35</div>
            {/* </Link> */}
          </CDropdownItem>
        ))}
      </CDropdownMenu>
    </CDropdown>
  )
}

export default React.memo(AppNotificationDropdown)
