"use client";

import "core-js";

import React, { useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { apiRequest } from "app/api/apiRequest";
import { useSession } from "next-auth/react";
// import { useNavigate } from "react-router-dom";

const CreatePassword = () => {
  let { update } = useSession()

  const [validate, setValidate] = useState(false);
  const [newPasswordValid, setNewPasswordValid] = useState(false);
  const [newPasswordInvalid, setNewPasswordInvalid] = useState(false);
  const [confirmPasswordValid, setConfirmPasswordValid] = useState(false);
  const [confirmPasswordInvalid, setConfirmPasswordInvalid] = useState(false);
  const setter = {
    setNewPasswordValid,
    setNewPasswordInvalid,
    setConfirmPasswordValid,
    setConfirmPasswordInvalid,
  } as any;

  const passwordSameValidation = (newPassword: string, confirmPassword: string) => {
    if(newPassword && confirmPassword && newPassword === confirmPassword) {
      setConfirmPasswordInvalid(false);
      return true;
    } else {
      setConfirmPasswordInvalid(true);
      return false;
    }
  }
  
  const onSubmit = async(event:any)=> {
    event.preventDefault();
    let { newPassword, confirmPassword } = event.target;
    newPassword = newPassword.value;
    confirmPassword = confirmPassword.value;
    if (passwordSameValidation(newPassword, confirmPassword)) {
      const result = await apiRequest('post', 'auth/newpassword', {
        newPassword,
        confirmPassword,
      });
      update();
    }
  };

  const onChange = (event:any)=> {
    const calleeName: string = "set"+event.target.id + 'Valid';
    if(event.target.value.length >= 8)
      setter[calleeName](true);
    else
      setter[calleeName](false);
  }
  const onBlur = (event:any)=> {
    const calleeName: string = "set"+event.target.id + 'Invalid';
    if(event.target.value.length < 8)
      setter[calleeName](true);
    else
      setter[calleeName](false);
  }
  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onSubmit={onSubmit}>
                    <h1>비밀번호 생성</h1>
                    <p className="text-body-secondary">처음 접속 시 비밀번호 초기화가 필요합니다.</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        id="NewPassword"
                        name="newPassword"
                        placeholder="비밀번호"
                        floatingLabel="비밀번호"
                        autoComplete="new-password"
                        valid={newPasswordValid}
                        invalid={newPasswordInvalid}
                        feedbackInvalid="비밀번호는 8자 이상으로 입력해주세요."
                        onChange={onChange}
                        onBlur={onBlur}
                        required
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        id="ConfirmPassword"
                        name="confirmPassword"
                        placeholder="비밀번호 확인"
                        floatingLabel="비밀번호 확인"
                        autoComplete="confirm-password"
                        feedbackInvalid="비밀번호가 다릅니다."
                        valid={confirmPasswordValid}
                        invalid={confirmPasswordInvalid}
                        onChange={onChange}
                        required
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton
                          color="primary"
                          className="px-4"
                          type="submit"
                        >
                          확인
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right">
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default CreatePassword
