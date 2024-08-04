// "use client"

import React, { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react'
import {
  CButton,
  CForm,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CInputGroup,
  CInputGroupText,
  CFormInput,
  CFormSelect
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilUser, cilCalendar, cilAddressBook, cilCheck, cilCopy, cilNotes, cilPhone, cilPeople } from '@coreui/icons'
import {
  DateTimePicker,
  DateTimeValidationError,
  LocalizationProvider,
  PickerChangeHandlerContext,
} from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs'

import { Address, DaumPostcodeEmbed } from "react-daum-postcode";
import { userInfo } from 'auth'
import { dateToForm, resultList, resultMap } from 'app/scheduleUtil'
import { Role, ScheduleResult } from '@prisma/client'
import { IMaskMixin, MaskPropsKeys } from 'react-imask'
import { initKakao } from 'kakao-js-sdk';
import { UserInfo } from 'app/store'
import { useAppSelector } from 'app/hooks'

interface form {
  company: string,
  companyManager: string,
  phone: string,
  address: string,
  note: string,
  date: string,
  manager: string,
  result: ScheduleResult,
}

const isPhone = ()=> {
  const phoneRegex = /iPhone|Android/;
  return navigator.userAgent.toString().match(/iPhone|Android/);
}

const CFormInputWithMask = IMaskMixin(({ inputRef, ...props }: {inputRef: any, [x: string]: any}) => (
  <CFormInput {...props} ref={inputRef} />
))

const formDefault: form = {
  company: '',
  companyManager: '',
  phone: '',
  address: '',
  note: '',
  date: '',
  manager: '',
  result: resultList[0], //
}

const kakaoKey: string = process.env.KAKAO_SDK_KEY || "18e5eed79170a888a460e63b085421a3";
let loadFireMap = false;
const loadKakaoMap = ()=> new Promise<any>((resolve, reject) => {
  if(loadFireMap)
    return resolve((window as any).kakao as any);
  if (typeof window !== "undefined") {
      loadFireMap = true;
      var script = document.createElement("script");
      script.onload = function () {
          resolve((window as any).kakao as any);
      };
      script.onerror = (e) => {
          reject(e);
      };
      script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoKey}&libraries=services`;
      script.integrity =
          "sha384-TiCUE00h649CAMonG018J2ujOgDKW/kVWlChEuu4jK2vxfAAD0eZxzCKakxg55G4";
      script.crossOrigin = "anonymous";
      document.head.appendChild(script);
  }
  return resolve({})
});

const loadKakaoSDK = async()=>{
  if(!window.Kakao)
    await initKakao(kakaoKey);
  return window.Kakao;
}


const ScheduleInfo = (props:any) => {
  const { visible, onClose, onSubmit, onRemove, schedule } = props;
  const [ currentSchedule, setCurrentSchedule ] = useState();
  const [ form, setForm ] = useState(formDefault as form);
  const [ addressSoftModal, setAddressSoftModal ] = useState(false)
  const [ needRefresh, setNeedRefresh ] = useState(false);
  const user: UserInfo = useAppSelector((state) => state.userInfo)
  const { role, workers } = user as any;
  
  if (role === Role.SALES) {
    Promise.all([
      loadKakaoSDK(),
      loadKakaoMap(),
    ]);
  }
  
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
    if(schedule) {
      let newForm: {[x:string]: any} = {};
      for(let key in schedule) {
        if(schedule[key])
          newForm[key] = schedule[key]
      }
      setForm({
        ...(newForm as form),
      });
    } else {
      setForm({
        ...formDefault,
      })
    }
  }, [schedule])
  
  const onModalClose = ()=> {
    setForm({
      ...formDefault,
    });
    onClose();
  }
  const onAddressModalClose = ()=> {
    setAddressSoftModal(false);
  }
  const onScheduleSubmit = (event: FormEvent)=> {
    onSubmit(event);
    setForm({
      ...formDefault
    });
}

  const onScheduleRemove = ()=> {

  }
  const handleAddress = (_address: Address)=> {
    onAddressModalClose();
    if(_address.address)
      setForm({...form, address: _address.address});
  }

  const handleDatePickerChange = (e: any, b: any)=> {
    let _date;
    try {
      _date = e && new Date(e.toISOString());
    } catch(e) {}
    _date && setForm({...form, date: dateToForm(_date, dateToForm.WITHHOUR)})
  }

  const handleChange = (e: ChangeEvent)=> {
    const { name, value } = e?.target as any;
    if(typeof value === 'string')
      setForm({...form, [name]: value})
  }

  const handleMaskChange = (phone:string, mask: MaskPropsKeys, e: InputEvent)=> {
    if(typeof phone === 'string')
      setForm({...form, phone})
  }

  const handleNaviButton = ()=> {
    if(!form.address) return alert('주소가 없습니다.');
    Promise.all([
      loadKakaoSDK(),
      loadKakaoMap(),
    ])
    .then(([Kakao, KakaoMap])=> {

      // let kakao = (window as any).kakao;
      let geocoder = new KakaoMap.maps.services.Geocoder();
        geocoder.addressSearch(form.address, (result: any, status: any)=> {
            Kakao.Navi.share({
              name: result[0].address_name,
              x: parseFloat(result[0].x) as any,
              y: parseFloat(result[0].y) as any,
              coordType: "wgs84",
            })
        })
    })
  }

  const handleCallButton = ()=> {
    location.href = 'tel:'+form.phone
  }

  const IconLabel = ({icon}: {icon: string[]})=> {
    return (
      <CInputGroupText>
        <CIcon icon={icon} />
      </CInputGroupText>
  )};
  return (
    <>
      <LocalizationProvider
        dateAdapter={AdapterDayjs}
        adapterLocale="ko"
      >
        <CModal visible={visible} backdrop="static" onClose={onModalClose}>
          <CModalHeader>
            <CModalTitle>일정상세</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CForm>
              <CInputGroup className="mb-4">
                <IconLabel icon={cilAddressBook}/>
                <CFormInput
                  type="text"
                  name="company"
                  readOnly={role === Role.SALES}
                  placeholder="상호"
                  floatingLabel="상호"
                  value={form.company}
                  onChange={handleChange}
                />
              </CInputGroup>
              <CInputGroup className="mb-4">
                <IconLabel icon={cilPeople} />
                <CFormInput
                  type="text"
                  name="companyManager"
                  readOnly={role === Role.SALES}
                  placeholder="거래처 담당자"
                  floatingLabel="거래처 담당자"
                  value={form.companyManager}
                  onChange={handleChange}
                />
              </CInputGroup>
              <CInputGroup className="mb-4">
                <IconLabel icon={cilPhone} />
                <CFormInputWithMask
                  type="tel"
                  name="phone"
                  readOnly={role === Role.SALES}
                  placeholder="연락처"
                  floatingLabel="연락처"
                  value={form.phone}
                  onAccept={handleMaskChange}
                  mask={[
                    "00-000-0000",
                    "02-0000-0000",
                    "000-000-0000",
                    "000-0000-0000",
                  ]}
                  unmask={true}
                  lazy={false}
                />
                {isPhone() ?
                  <CInputGroupText><CButton onClick={handleCallButton}><CIcon icon={cilPhone}/></CButton></CInputGroupText>
                :null}
              </CInputGroup>
              <CInputGroup className="mb-4">
                <IconLabel icon={cilNotes} />
                <CFormInput
                  type="text"
                  name="note"
                  readOnly={role === Role.SALES}
                  placeholder="부가설명"
                  floatingLabel="부가설명"
                  autoComplete="new-password"
                  value={form.note}
                  onChange={handleChange}
                />
              </CInputGroup>
              <CInputGroup className="mb-4">
                <IconLabel icon={cilAddressBook} />
                <CFormInput
                  type="text"
                  name="address"
                  readOnly={role === Role.SALES}
                  placeholder="주소"
                  floatingLabel="주소"
                  autoComplete="new-password"
                  value={form.address}
                  onClick={()=>{!form.address && setAddressSoftModal(true)}}
                  onChange={handleChange}
                />
                <CInputGroupText>
                  {role === Role.SALES ? 
                    <CButton onClick={handleNaviButton}><CIcon icon={cilCopy}/></CButton>
                  :
                    <CButton onClick={()=>setAddressSoftModal(true)}>찾기</CButton>
                  }
                </CInputGroupText>
              </CInputGroup>
              <CInputGroup className="mb-4">
                <IconLabel icon={cilCalendar} />
                <DateTimePicker
                  format="YYYY-MM-DD HH:mm"
                  name="date"
                  readOnly={role === Role.SALES}
                  // locale={ko}
                  timezone="system"
                  ampm={false}
                  value={dayjs(form.date)}
                  // defaultValue={dayjs(Date.now())}
                  onChange={handleDatePickerChange}
                  />
              </CInputGroup>
              <CInputGroup className="mb-4" hidden={role === Role.SALES}>
                <IconLabel icon={cilUser} />
                <CFormSelect
                  name="manager"
                  value={form.manager}
                  disabled={role === Role.SALES}
                  onChange={handleChange}
                >
                  <option value="">담당영업 선택</option>
                  {workers ? workers.filter((worker: userInfo)=>worker.role === Role.SALES).map((worker: userInfo)=>
                    <option key={worker.email} value={worker.email}>{worker.name}</option>
                  ) : null}
                </CFormSelect>
              </CInputGroup>
              <CInputGroup className="mb-4">
                <IconLabel icon={cilCheck} />
                  <CFormSelect
                    name="result"
                    disabled={role !== Role.SALES}
                    value={form.result}
                    onChange={handleChange}
                  >
                    {resultList.map((_result, i)=>
                      <option key={i} value={resultList[i]}>{resultMap[_result]}</option>
                    )}
                  </CFormSelect>
              </CInputGroup>
            </CForm>
          </CModalBody>
          <CModalFooter>
            {schedule && role !== Role.SALES ?
              <CButton color="secondary" onClick={()=>onRemove(schedule.id)}>삭제</CButton>
            :null}
            <CButton color="primary" onClick={()=> {
              onSubmit(form, schedule?.id ? true : false);
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

export default React.memo(ScheduleInfo);