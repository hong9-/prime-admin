"use client";

import "core-js";
import React, { useEffect, useState } from 'react'
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
import UserInfo from "./UserInfo";

interface person {
  id: string,
  name: string,
  role: string,
  inited: boolean,
}
const examplePeople: Array<person> = [
  {
    id: 'tm001',
    name: '김모씨',
    role: 'TM',
    inited: false,
  },
  {
    id: 'tm002',
    name: '이모씨',
    role: 'TM',
    inited: true,
  },
  {
    id: 'tm003',
    name: '박모씨',
    role: 'TM',
    inited: false,
  },
  {
    id: 'sales001',
    name: '최모씨',
    role: 'SALE',
    inited: false,
  },
  {
    id: 'sales002',
    name: '정모씨',
    role: 'SALE',
    inited: false,
  },
  {
    id: 'sales003',
    name: '홍모씨',
    role: 'SALE',
    inited: false,
  },
]

let _modal: boolean = false;
let _selectedUser: any = undefined;
const UserList = () => {
  let [ modal, setModal ] = useState(_modal);
  let [ user, setUser ] = useState(_selectedUser);
  user = _selectedUser;
  useEffect(()=> {
    console.log('useEffect');
  }, []);

  const onPasswordInitClick = (id:string)=> {
    confirm(`비밀번호 초기화 ${id}`)
  }
  const onUserRemove = (id:string)=> {
    confirm(`유저 삭제 ${id}`)
    console.log('Remove user', id);
  }

  const onUserClick = (user:any)=> {
    _selectedUser = user;
    _modal = true;
    // setUser(user);
    setModal(true);
  }

  const onCloseModal = ()=> {
    _modal = false;
    // setUser(undefined);
    _selectedUser = undefined;
    setModal(false);
  }

  const onUserAdd = (user: any)=> {
    console.log('useradd', user);
    fetch('/api/user', {
      method: 'POST',
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(user),
    })
    setModal(false);
  }

  console.log(modal, user, _selectedUser);
  return (
    <>
      <CCard className="mb-4">
        <CCardHeader>
          <strong>직원 관리</strong>
        </CCardHeader>
        <CCardBody>
          <CTable >
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col">ID</CTableHeaderCell>
                <CTableHeaderCell scope="col">이름</CTableHeaderCell>
                <CTableHeaderCell scope="col">직원분류</CTableHeaderCell>
                <CTableHeaderCell scope="col">비밀번호 재설정</CTableHeaderCell>
                <CTableHeaderCell scope="col">삭제</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              {examplePeople.map((person, i)=> {
                return (
                  <CTableRow key={person.id}>
                    <CTableDataCell onClick={()=>onUserClick(person)}>{person.id}</CTableDataCell>
                    <CTableDataCell onClick={()=>onUserClick(person)}>{person.name}</CTableDataCell>
                    <CTableDataCell onClick={()=>onUserClick(person)}>{person.role}</CTableDataCell>
                    <CTableDataCell>{person.inited ? <CButton color="danger" onClick={()=>onPasswordInitClick(person.id)}>재설정</CButton> : null}</CTableDataCell>
                    <CTableDataCell><CButton color="danger" onClick={()=>onUserRemove(person.id)}>삭제</CButton></CTableDataCell>
                  </CTableRow>
                )
              })}
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
      <UserInfo
        visible={modal}
        onClose={onCloseModal}
        onSubmit={onUserAdd}
        user={_selectedUser}
      />
    </>
  )
}
  
export default UserList;
