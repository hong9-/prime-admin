"use client";
import "core-js";

import React, { ChangeEvent, FormEvent, FormEventHandler, useState } from 'react'
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
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

let validationTimeoutId: NodeJS.Timeout;
const Login = () => {
  const [ userId, setUserId ] = useState('');
  const [ pw, setPw ] = useState('');
  const [ checkPassword, setCheckPassword ] = useState(false);
  const route = useRouter();

  const setter = {
    setUserId,
    setPw,
  } as any;

  const validateForm = ()=> {
    if(!userId || !pw) {
      return false;
    } else {
      return true;
    }
  }
  const sign = async(id: string, password: string)=> {
    return await signIn("credentials", { id, password, redirect: false });
  }
  const onSubmit:FormEventHandler = async(event:FormEvent)=> {
    event.preventDefault();
    event.preventDefault();
    // let { userId, password } = event.target as any;
    // userId = userId.value;
    // password = password.value;
    console.log(`event 막혔나?1`, event.isDefaultPrevented());
    try {
      console.log(`event 막혔나?2`, event.isDefaultPrevented());
      console.log(event);
      const hello = await sign(userId, pw);
      console.log(hello);
      setCheckPassword(true);
      if(validationTimeoutId)
        clearTimeout(validationTimeoutId);
      validationTimeoutId = setTimeout(()=> {
        setCheckPassword(false);
      }, 3000);
      console.log('sign done');
    } catch(e) {
      console.log('error: ', e)
    }

    event.preventDefault();
    // return false;
    // console.log('onsubmit', event, userId, password)
    // navigate('/');
    // return event;
  };

  const onChange = (event:ChangeEvent)=> {
    let target:any = event.target;
    const calleeName: string = "set"+target.id;
    setter[calleeName](target.value);
  }

  console.log(`CheckPassword: ${checkPassword}`);
  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm
                    onSubmit={onSubmit}
                    // noValidate={checkPassword}
                    // inval
                    // validated={checkPassword}
                  >
                    <h1>로그인</h1>
                    <p className="text-body-secondary">Sign In to your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="아이디"
                        floatingLabel="아이디"
                        autoComplete="userId"
                        onChange={onChange}
                        name="userId"
                        id="UserId"
                        value={userId}
                        invalid={checkPassword}
                        required
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        floatingLabel="비밀번호"
                        placeholder="비밀번호"
                        autoComplete="current-password"
                        onChange={onChange}
                        name="password"
                        invalid={checkPassword}
                        // feedbackInvalid={"아이디 또는 비밀번호를 확인하세요"}
                        id="Pw"
                        value={pw}
                        required
                      />
                    </CInputGroup>
                    <CInputGroup className={"mb-4 password-alert" + (checkPassword ? " invalid" : "")}>
                      아이디 또는 패스워드를 확인하세요.
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton
                          color="primary"
                          className="px-4"
                          type="submit"
                          // onClick={onSubmit}
                        >
                          로그인
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right">
                        {/* <CButton color="link" className="px-0">
                          Forgot password?
                        </CButton> */}
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
  
export default Login
  