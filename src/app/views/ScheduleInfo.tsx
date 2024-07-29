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
  DateTimeValidationError,
  LocalizationProvider,
  PickerChangeHandlerContext,
} from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs'
import { UserInfo, state } from 'app/store'
import { useAppSelector } from 'app/hooks'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

import { Address, DaumPostcodeEmbed } from "react-daum-postcode";
import { userInfo } from 'auth'
import { dateToForm, resultList, resultMap } from 'app/scheduleUtil'
import { ScheduleResult } from '@prisma/client'

const ScheduleInfo = (props:any) => {
  const { visible, onClose, onSubmit, onRemove, schedule } = props;
  const { userInfo } = useAppSelector((state:state)=>state) || {userId: '', name: '', role: '', sales: []};
  const [ currentSchedule, setCurrentSchedule ] = useState();
  // console.log(test);
  const [ address, setAddress ] = useState('');
  const [ date, setDate ] = useState(dateToForm(new Date()));
  // const [ manager, setManager ] = useState(schedule.manager || '담당자 선택');
  const [ manager, setManager ] = useState(schedule.manager || '');
  const [ result, setResult ] = useState(schedule.result || resultList[0] as ScheduleResult);
  const [ addressSoftModal, setAddressSoftModal ] = useState(false)
  const [ needRefresh, setNeedRefresh ] = useState(false);
  const { workers } = useSession().data?.user as any;
  
  // console.log(workers);
  let currentSales: Array<UserInfo> = workers || [{
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
    console.log(schedule);
    // if(schedule) {
      // console.log("changed", schedule)
      // setId(schedule ? schedule.id : "");
      setAddress(schedule && schedule.address || "");
      setDate(schedule && schedule.date || dateToForm(new Date()));
      setManager(schedule && schedule.manager || "");
      setResult(schedule && schedule.result || resultList[0]);
      setCurrentSchedule(schedule);
    // } else {
      // console.log("Not changed");
    // }
  }, [/*currentSchedule, */schedule])
  // console.log(date);
  
  const onModalClose = ()=> {
    setCurrentSchedule(undefined);
    setAddress(schedule && schedule.address || "");
    setDate(schedule && schedule.date || dateToForm(new Date()));
    setManager(schedule && schedule.manager || "");
    setResult(schedule && schedule.result || resultList[0]);
    onClose();
  }
  const onAddressModalClose = ()=> {
    setAddressSoftModal(false);
  }
  const onScheduleSubmit = (event: FormEvent)=> {
    console.log(event);
    onSubmit(event);
    setAddress(schedule && schedule.address || "");
    setDate(schedule && schedule.date || dateToForm(new Date()));
    setManager(schedule && schedule.manager || "");
    setResult(schedule && schedule.result || resultList[0]);
}

  const onScheduleRemove = ()=> {

  }
  const handleAddress = (_address: Address)=> {
    console.log(_address)
    _address.address
    onAddressModalClose();
    setAddress(_address.address);
  }

  const handleDatePickerChange = (e: any, b: any)=> {
    let _date;
    try {
      _date = e && new Date(e.toISOString());
    } catch(e) {}
    _date && setDate(dateToForm(_date, dateToForm.WITHHOUR))
  }

  const handleChange = ()=> {

  }
  // console.log(manager, result);
  return (
    <>
      <LocalizationProvider
        dateAdapter={AdapterDayjs}
        adapterLocale='ko'
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
                  onClick={()=>setAddressSoftModal(true)}
                  onChange={(e)=> {setAddress(e.currentTarget.value)}}
                />
              </CInputGroup>
              <CInputGroup className="mb-4">
                <CInputGroupText>
                  <CIcon icon={cilCalendar} />
                </CInputGroupText>
                <DateTimePicker
                  // label="방문날짜"
                  format="YYYY-MM-DD HH:mm"
                  timezone="system"
                  ampm={false}
                  value={dayjs(date)}
                  // defaultValue={dayjs(Date.now())}
                  onChange={handleDatePickerChange}
                />
              </CInputGroup>
              <CInputGroup className="mb-4">
                <CInputGroupText>
                  <CIcon icon={cilUser} />
                </CInputGroupText>
                  <CFormSelect id="inputGroupSelect01"
                    value={manager}
                    onChange={(e)=> setManager(e.target.value)}
                  >
                    <option value="">담당자 선택</option>
                    {/* {currentSales.map((_man)=>(
                      <option key={_man.email} value={_man.email}>{_man.name}</option>
                    ))} */}
                    {workers ? workers.map((worker: userInfo)=>
                      <option key={worker.email} value={worker.email}>{worker.name}</option>
                    ) : null}
                  </CFormSelect>

              </CInputGroup>
              <CInputGroup className="mb-4">
                <CInputGroupText>
                  <CIcon icon={cilCheck} />
                </CInputGroupText>
                  <CFormSelect id="inputGroupSelect01"
                    value={result}
                    onChange={(e)=> {setResult(e.target.value)}}
                  >
                    {resultList.map((_result, i)=>
                      <option key={i} value={resultList[i]}>{resultMap[_result]}</option>
                    )}
                  </CFormSelect>

              </CInputGroup>
            </CForm>
          </CModalBody>
          <CModalFooter>
            {schedule ?
              <CButton color="secondary" onClick={()=>onRemove(schedule.id)}>삭제</CButton>
            :null}
            <CButton color="primary" onClick={()=> {
              onSubmit({address, date, result, manager});
            }}>{schedule ? "저장" : "생성"}</CButton>
            <CButton color="secondary" onClick={onModalClose}>
              닫기
            </CButton>
          </CModalFooter>
        </CModal>

        <CModal visible={addressSoftModal} onClose={onAddressModalClose}>
          <CModalBody>
            <DaumPostcodeEmbed onComplete={handleAddress} />
          </CModalBody>
        </CModal>
      </LocalizationProvider>
    </>
  )
}

export default ScheduleInfo;