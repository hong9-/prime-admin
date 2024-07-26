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
import UserInfo from "./UserInfo";
import { apiRequest } from "app/api/apiRequest";

interface person {
  email: string,
  name: string,
  role: string,
  inited: boolean,
}

const examplePeople: Array<person> = [
  {
    email: 'tm001',
    name: '김모씨',
    role: 'TM',
    inited: false,
  },
  {
    email: 'tm002',
    name: '이모씨',
    role: 'TM',
    inited: true,
  },
  {
    email: 'tm003',
    name: '박모씨',
    role: 'TM',
    inited: false,
  },
  {
    email: 'sales001',
    name: '최모씨',
    role: 'SALE',
    inited: false,
  },
  {
    email: 'sales002',
    name: '정모씨',
    role: 'SALE',
    inited: false,
  },
  {
    email: 'sales003',
    name: '홍모씨',
    role: 'SALE',
    inited: false,
  },
]

let _modal: boolean = false;
let _selectedUser: any = undefined;
const UserList = () => {
  let [ modal, setModal ] = useState(_modal);
  let [ people, setPeople ] = useState(undefined as Array<person> | undefined);
  let [ user, setUser ] = useState(_selectedUser);
  user = _selectedUser;

  useEffect(()=> {
    apiRequest('get', 'user').then(({ code, people: _people })=> {
      if(code !== 0) {
        alert('error');
        return;
      }
      console.log('setPeople done', _people)
      if(_people)
        return _people;
        // setPeople(_people);
    }).then((_people)=> setPeople(_people));
  
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
    }).then((result)=> {
      console.log(result);
    });
    setModal(false);
  }

  console.log('render check', modal, user, _selectedUser, people);
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
              {people ? people.map((person, i)=> {
                return (
                  <CTableRow key={i}>
                    <CTableDataCell onClick={()=>onUserClick(person)}>{person.email}</CTableDataCell>
                    <CTableDataCell onClick={()=>onUserClick(person)}>{person.name}</CTableDataCell>
                    <CTableDataCell onClick={()=>onUserClick(person)}>{person.role}</CTableDataCell>
                    <CTableDataCell>{person.inited ? <CButton color="danger" onClick={()=>onPasswordInitClick(person.email)}>재설정</CButton> : null}</CTableDataCell>
                    <CTableDataCell><CButton color="danger" onClick={()=>onUserRemove(person.email)}>삭제</CButton></CTableDataCell>
                  </CTableRow>
                )
              }):
              <div className="pt-3 page-loading text-center">
                <CSpinner color="primary" variant="grow" />
              </div>}
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
