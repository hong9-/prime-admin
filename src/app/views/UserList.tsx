"use client";

import "core-js";
import React, { useEffect, useState, Suspense } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CSpinner,
  CCardFooter,
  CCardTitle,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilPeople, cilPhone } from '@coreui/icons'
import UserInfo from "./UserInfo";
import { apiRequest } from "app/api/apiRequest";

interface person {
  email: string,
  name: string,
  role: string,
  needPasswordReset: boolean,
  isRemove: boolean,
}

let _modal: boolean = false;
let _selectedUser: any = undefined;
const UserList = () => {
  let [ modal, setModal ] = useState(_modal);
  let [ people, setPeople ] = useState(undefined as Array<person> | undefined);
  let [ user, setUser ] = useState(_selectedUser);
  let [ listChanged, setListChanged ] = useState(1);
  user = _selectedUser;

  useEffect(()=> {
    apiRequest('get', 'user').then(({ code, people: _people, message })=> {
      if(code !== 0) {
        alert('error: '+message);
        return;
      }
      if(_people)
        return _people;
    }).then((_people)=> setPeople(_people));
  
  }, [listChanged]);

  const onPasswordInitClick = (email:string)=> {
    if(confirm(`사용자 ${email}의 비밀번호를 초기화하시겠습니까?`)) {
      apiRequest('post', 'user/update', { email, needPasswordReset: true }).then((res)=> {
        let {code, message} = res;
        if(code) return alert('삭제 실패:\n\n' + (message || JSON.stringify(res)));
        alert('초기화 성공');
        setListChanged(++listChanged);
      });
    }
    
  }
  const onUserRemove = (email:string)=> {
    if(confirm(`사용자 ${email}(을/를) 삭제하시겠습니까?`)) {
      apiRequest('post', 'user/remove', { email }).then((res)=> {
        let {code, message} = res;
        if(code) return alert('삭제 실패:\n\n' + (message || JSON.stringify(res)));
        alert('삭제 성공');
        setListChanged(++listChanged);
      });
    }
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
    if(!user.email || !user.role || !user.name)
      return alert("ID, 이름, 직원 항목은 필수값입니다.");
    apiRequest('post', 'user/create', user).then((result)=> {
      const { code, message } = result as any;
      if(code) return alert('생성 실패' + JSON.stringify(message));
      alert('등록 성공');
      setListChanged(++listChanged);
    });
    setModal(false);
  }

  return (
    <>
      <CCard className="mb-4">
        <CCardHeader>
          <CCardTitle><strong>직원 관리</strong></CCardTitle>
        </CCardHeader>
        <CCardBody>
          <div className="align-right">
            <CButton
              color="primary"
              onClick={()=>{_modal = true;setModal(true);}}
              className="align-right"
            >직원 등록</CButton>
          </div>
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
                if (person.isRemove) return null;
                return (
                  <CTableRow key={i}>
                    <CTableDataCell onClick={()=>onUserClick(person)}>{person.email}</CTableDataCell>
                    <CTableDataCell onClick={()=>onUserClick(person)}>{person.name}</CTableDataCell>
                    <CTableDataCell onClick={()=>onUserClick(person)}>
                      {person.role} {person.role === 'TM'
                        ? <CIcon icon={cilPhone}/>
                        : <CIcon icon={cilPeople}/>
                      }
                    </CTableDataCell>
                    <CTableDataCell>{!person.needPasswordReset ? <CButton color="primary" onClick={()=>onPasswordInitClick(person.email)}>재설정</CButton> : null}</CTableDataCell>
                    <CTableDataCell>{!person.isRemove ? <CButton color="danger" variant="outline" onClick={()=>onUserRemove(person.email)}>삭제</CButton> : null}</CTableDataCell>
                  </CTableRow>
                )
              }):
              <div className="pt-3 page-loading text-center">
                <CSpinner color="primary" variant="grow" />
              </div>}
            </CTableBody>
          </CTable>
        </CCardBody>
        <CCardFooter>
        </CCardFooter>
      </CCard>
      <UserInfo
        visible={modal}
        onClose={onCloseModal}
        onSubmit={onUserAdd}
        onRemove={onUserRemove}
        user={_selectedUser}
      />
    </>
  )
}
  
export default UserList;
