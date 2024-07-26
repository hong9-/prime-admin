"use client"

import React, { FormEvent, useEffect, useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CLink,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CPopover,
  CRow,
  CTooltip,
  CInputGroup,
  CInputGroupText,
  CFormInput,
  CFormSelect
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilUser, cilCalendar, cilAddressBook, cilCheck } from '@coreui/icons'
import {
  DateTimePicker,
  LocalizationProvider,
} from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs'
import { UserInfo, state } from 'app/store'
import { dateToForm } from './ScheduleList'
import { useAppSelector } from 'app/hooks'
import { useSession } from 'next-auth/react'

const ScheduleInfo = (props:any) => {
  const { visible, onClose, onSubmit, schedule } = props;
  const { userInfo } = useAppSelector((state:state)=>state) || {userId: '', name: '', role: '', sales: []};
  const [currentSchedule, setCurrentSchedule] = useState();
  const [address, setAddress] = useState('');
  let test = dateToForm(new Date(), true);
  console.log(test);
  const [date, setDate] = useState(test);
  const [manager, setManager] = useState('');
  // const { workers } = useSession().data;
  

  let currentSales: Array<UserInfo> = userInfo?.workers || [{
    email: 'abcde',
    name: '박과장',
    role: 'sales',
  }, {
    email: 'fghij',
    name: '김대리',
    role: 'sales',
  }, {
    email: 'klmno',
    name: '이대리',
    role: 'sales',
  }];

  useEffect(()=> {
    // if(schedule) {
      console.log("changed", schedule)
      // setId(schedule ? schedule.id : "");
      setAddress(schedule ? schedule.address: "");
      setDate(schedule ? schedule.date: dateToForm(new Date(), true));
      setManager(schedule ? schedule.manager: "");
      setCurrentSchedule(schedule);
    // } else {
      // console.log("Not changed");
    // }
  }, [/*currentSchedule, */schedule])
  // console.log(date);
  
  const onModalClose = ()=> {
    setCurrentSchedule(undefined);
    setAddress(schedule ? schedule.address: "");
    setDate(schedule ? schedule.date: "");
    setManager(schedule ? schedule.manager: "");
    onClose();
  }

  const onScheduleSubmit = (event: FormEvent)=> {
    console.log(event);
    onSubmit(event);
    setAddress(schedule ? schedule.address: "");
    setDate(schedule ? schedule.date: "");
    setManager(schedule ? schedule.manager: "");
  }
  return (
    <>
      <LocalizationProvider
        dateAdapter={AdapterDayjs}
        adapterLocale='kr'
      >
        <CModal visible={visible} onClose={onModalClose}>
          <CModalHeader>
            <CModalTitle>일정상세</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CForm>
              <CInputGroup className="mb-3">
                <CInputGroupText>
                  <CIcon icon={cilAddressBook} />
                </CInputGroupText>
                <CFormInput
                  type="text"
                  placeholder="주소"
                  floatingLabel="주소"
                  autoComplete="new-password"
                  value={address}
                  onChange={(event)=> {console.log(this, event)}}
                />
              </CInputGroup>
              <CInputGroup className="mb-4">
                <CInputGroupText>
                  <CIcon icon={cilCalendar} />
                </CInputGroupText>
                {/* <CFormInput
                  type="date"
                  placeholder="방문날짜"
                  floatingLabel="방문날짜"
                  // autoComplete="visit-date"
                /> */}
                <DateTimePicker
                  // label="방문날짜"
                  format="YYYY-MM-DD HH:mm"
                  timezone="system"
                  ampm={false}
                  value={dayjs(date)}
                  // defaultValue={dayjs(Date.now())}
                  onChange={(event)=> {console.log(this, event)}}
                />
              </CInputGroup>
              <CInputGroup className="mb-4">
                <CInputGroupText>
                  <CIcon icon={cilUser} />
                </CInputGroupText>
                  {/* <CInputGroupText as="label" htmlFor="inputGroupSelect01">
                    Options
                  </CInputGroupText> */}
                  <CFormSelect id="inputGroupSelect01"
                    value={manager}
                    onChange={(event)=> {console.log(this, event)}}
                  >
                    <option>담당자 선택</option>
                    {currentSales.map((_man)=>(
                      <option key={_man.email}>{_man.name}</option>
                    ))}
                  </CFormSelect>

              </CInputGroup>
              <CInputGroup className="mb-4">
                <CInputGroupText>
                  <CIcon icon={cilCheck} />
                </CInputGroupText>
                  {/* <CInputGroupText as="label" htmlFor="inputGroupSelect01">
                    Options
                  </CInputGroupText> */}
                  <CFormSelect id="inputGroupSelect01"
                    value={manager}
                    onChange={(event)=> {console.log(this, event)}}
                  >
                    <option>방문 예정</option>
                    <option>계약</option>
                    <option>보류</option>
                    <option>무관심</option>
                  </CFormSelect>

              </CInputGroup>            </CForm>
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={onModalClose}>
              닫기
            </CButton>
            {onSubmit ?
              <CButton color="primary" onSubmit={onScheduleSubmit}>저장</CButton>
            :null}
          </CModalFooter>
        </CModal>
      </LocalizationProvider>
    </>
  )
}

export default ScheduleInfo;