'use client'

import React, { useEffect } from 'react'
import {
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import {
  cilBell,
  cilBellExclamation,
} from '@coreui/icons'
import CIcon from '@coreui/icons-react'

import { Notification, UserInfo } from "app/store";
import { useRouter } from 'next/navigation'
import { apiRequest } from 'app/api/apiRequest'
import { useAppSelector } from 'app/hooks'
import { Role } from '@prisma/client'
import { useSession } from 'next-auth/react'
import { dateToForm } from 'app/scheduleUtil'

const AppNotificationDropdown = () => {
  const user: UserInfo = useAppSelector((state) => state.userInfo)
  const router = useRouter()
  let { update } = useSession();

  useEffect(()=>{}, [])

  const notiList:Array<Notification> = user?.Notifications || [];
  const onClick = (noti: Notification)=>{
    apiRequest('post', 'notification', {id: noti.id}).then(({code})=> {
      if(code === 0) {
        update();
        router.push(noti.link);
      }
    })
  }

  if(user.role !== Role.ADMIN)
    return <></>
  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle  className="" caret={false} disabled={notiList.length === 0}>
        <CIcon icon={cilBell} size="lg" />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0 notifications" >
        {notiList.map((noti: Notification, i: number)=> (
          <CDropdownItem
            key={i}
            className={(noti.confirmed ? "confirmed" : "")}
            onClick={()=>onClick(noti)}
          >
            <CIcon icon={noti.confirmed ? cilBellExclamation : cilBell } className="me-2" />
            {noti.message}
            <div className="notification-timestamp">{dateToForm(new Date(noti.createdAt), dateToForm.WITHHOUR)}</div>
          </CDropdownItem>
        ))}
      </CDropdownMenu>
    </CDropdown>
  )
}

export default React.memo(AppNotificationDropdown)
