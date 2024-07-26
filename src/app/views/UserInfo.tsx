"use client"

import React, { memo, useEffect, useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CLink,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CPopover,
  CRow,
  CTooltip,
  CForm,
  CInputGroup,
  CInputGroupText,
  CFormInput,
  CFormSelect,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilUser } from '@coreui/icons'

const UserInfo = (props: any) => {
  const {visible, onClose, onSubmit, onRemove, user} = props;
  const [currentUser, setCurrentUser] = useState();
  const [email, setEmail] = useState();
  const [name, setName] = useState();
  const [role, setRole] = useState();
  const [inited, setInited] = useState();
  useEffect(()=> {
    if(!currentUser) {
      setEmail(user ? user.email : "");
      setName(user ? user.name: "");
      setRole(user ? user.role: "");
      setInited(user ? user.inited: "");
      setCurrentUser(user);
    }
  }, [currentUser, user])
  
  return (
    <>
      <CModal visible={visible}>
        <CModalHeader>
          <CModalTitle>Modal title</CModalTitle>
        </CModalHeader>
        <CModalBody>
        <CForm>
          <CInputGroup className="mb-3">
            <CInputGroupText>
              <CIcon icon={cilUser} />
            </CInputGroupText>
            <CFormInput
              type="text"
              placeholder="ID"
              floatingLabel="ID"
              autoComplete="user-id"
              value={email}
              onChange={(e:any)=>setEmail(e.target.value)}
            />
          </CInputGroup>
          <CInputGroup className="mb-4">
            <CInputGroupText>
              <CIcon icon={cilUser} />
            </CInputGroupText>
            <CFormInput
              type="text"
              placeholder="이름"
              floatingLabel="이름"
              autoComplete="user-name"
              value={name}
              onChange={(e:any)=>setName(e.target.value)}
            />
          </CInputGroup>
          <CInputGroup className="mb-4">
            <CInputGroupText>
              <CIcon icon={cilUser} />
            </CInputGroupText>
            <CFormSelect
              floatingLabel="직원"
              aria-label="직원"
              value={role}
              onChange={(e:any)=>setRole(e.target.value)}
            >
              <option>TM</option>
              <option>SALE</option>
            </CFormSelect>
          </CInputGroup>
          {inited?
            (<CButton>비밀번호 재설정</CButton>)
          :null}
        </CForm>
            
        </CModalBody>
        <CModalFooter>
          {user ?
            <CButton color="secondary" onClick={()=>onRemove(email)}>삭제</CButton>
          :null}
          <CButton color="primary" onClick={()=> {
            onSubmit({email, name, role, inited});
          }}>{user ? "저장" : "생성"}</CButton>
          <CButton color="secondary" onClick={()=> {setCurrentUser(undefined);onClose();}}>
            닫기
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  )
}

export default UserInfo;