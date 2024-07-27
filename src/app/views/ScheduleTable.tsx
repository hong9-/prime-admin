"use client";

import "core-js";
import React, { useEffect, useState, Suspense } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCardGroup,
  CTable,
  CTableBody,
  CTableCaption,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CSpinner,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CAlert,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { setServers } from "dns";
import ScheduleInfo from "./ScheduleInfo";
import { apiRequest } from "app/api/apiRequest";
import { getScheduleList, schedule } from "app/scheduleUtil";

let _modal: boolean = false;
// let _selectedUser: any = undefined;
const ScheduleTable = () => {
  let [ modal, setModal ] = useState(_modal);
  let [ scheduleList, setScheduleList ] = useState([] as Array<schedule>)
  let [ schedule, setSchedule ] = useState({} as schedule)
  // let [ people, setPeople ] = useState(undefined as Array<person> | undefined);
  // let [ user, setUser ] = useState(_selectedUser);
  // user = _selectedUser;

  useEffect(()=> {
    getScheduleList().then((scheduleList)=> {
      setScheduleList(scheduleList);
    });
    // apiRequest('get', 'user').then(({ code, people: _people })=> {
    //   if(code !== 0) {
    //     alert('error');
    //     return;
    //   }
    //   console.log('setPeople done', _people)
    //   if(_people)
    //     return _people;
    //     // setPeople(_people);
    // }).then((_people)=> setPeople(_people));
  
  }, []);

  const onCloseModal = ()=> {
    _modal = false;
    // setUser(undefined);
    setModal(false);
  }

  return (
    <>
      <CCard className="mb-4">
        <CCardHeader>
          <strong>계약 관리</strong>
        </CCardHeader>
        <CCardBody>
          <CTable >
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col">스케줄ID</CTableHeaderCell>
                <CTableHeaderCell scope="col">주소</CTableHeaderCell>
                <CTableHeaderCell scope="col">일정</CTableHeaderCell>
                <CTableHeaderCell scope="col">담당TM</CTableHeaderCell>
                <CTableHeaderCell scope="col">담당영업</CTableHeaderCell>
                <CTableHeaderCell scope="col">상태</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {
              scheduleList ? scheduleList.map((schedule, i)=> {
                return (<></>
                  // <CTableRow key={i}>
                  //   <CTableDataCell onClick={()=>onUserClick(person)}>{person.email}</CTableDataCell>
                  //   <CTableDataCell onClick={()=>onUserClick(person)}>{person.name}</CTableDataCell>
                  //   <CTableDataCell onClick={()=>onUserClick(person)}>{person.role}</CTableDataCell>
                  //   <CTableDataCell>{person.inited ? <CButton color="danger" onClick={()=>onPasswordInitClick(person.email)}>재설정</CButton> : null}</CTableDataCell>
                  //   <CTableDataCell><CButton color="danger" onClick={()=>onUserRemove(person.email)}>삭제</CButton></CTableDataCell>
                  // </CTableRow>
                )
              })
              :
              <div className="pt-3 page-loading text-center">
                <CSpinner color="primary" variant="grow" />
              </div>
              }
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>
      <div className="align-right">
        <CButton
          color="primary"
          onClick={()=>{_modal = true;setModal(true);}}
        >직원 등록</CButton>
      </div>
      <ScheduleInfo
        visible={modal}
        schedule={schedule}
        onSubmit={()=>console.log('onSubmit')}
        onClose={()=>{_modal = false;setModal(false);setSchedule({} as schedule)}}
      />
    </>
  )
}
  
export default ScheduleTable;
